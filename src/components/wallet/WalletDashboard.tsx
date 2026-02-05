 import { useState } from 'react';
 import { motion } from 'framer-motion';
 import { 
   Wallet, Send, ArrowDownLeft, History, 
   TrendingUp, Shield, Zap, RefreshCw
 } from 'lucide-react';
 import { useWallet } from '@/hooks/useWallet';
 import { useAuth } from '@/hooks/useAuth';
 import { useSoundEffects } from '@/hooks/useSoundEffects';
 import { WalletBalanceCard } from './WalletBalanceCard';
 import { EconomySplitVisualizer } from './EconomySplitVisualizer';
 import { TransactionHistory } from './TransactionHistory';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from 'sonner';
 
 interface SendFormData {
   recipientEmail: string;
   amount: string;
   description: string;
 }
 
 export const WalletDashboard = () => {
   const { user } = useAuth();
   const { balance, transactions, splits, loading, refetch } = useWallet();
   const { playTransaction, playSuccess, playError } = useSoundEffects();
   const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'history'>('overview');
   const [sending, setSending] = useState(false);
   const [sendForm, setSendForm] = useState<SendFormData>({
     recipientEmail: '',
     amount: '',
     description: '',
   });
 
   const handleSend = async () => {
     if (!user || !sendForm.recipientEmail || !sendForm.amount) {
       toast.error('Completa todos los campos requeridos');
       playError();
       return;
     }
 
     const amount = parseFloat(sendForm.amount);
     if (isNaN(amount) || amount <= 0) {
       toast.error('Cantidad inválida');
       playError();
       return;
     }
 
     if (amount > balance) {
       toast.error('Saldo insuficiente');
       playError();
       return;
     }
 
     setSending(true);
 
     try {
       // Find recipient by email
       const { data: recipientProfile, error: profileError } = await supabase
         .from('profiles')
         .select('user_id, display_name')
         .eq('user_id', sendForm.recipientEmail)
         .single();
 
       // If not found by user_id, this is a limitation - we'd need email lookup
       // For now, assume recipientEmail is actually a user_id
       const recipientId = sendForm.recipientEmail;
 
       // Calculate 70/20/10 split
       const directAmount = amount * 0.70;
       const fenixAmount = amount * 0.20;
       const kernelAmount = amount * 0.10;
 
       // Create transaction hash
       const transactionData = JSON.stringify({
         from: user.id,
         to: recipientId,
         amount,
         timestamp: Date.now(),
       });
       const hashBuffer = await crypto.subtle.digest(
         'SHA-256',
         new TextEncoder().encode(transactionData)
       );
       const hash = Array.from(new Uint8Array(hashBuffer))
         .map(b => b.toString(16).padStart(2, '0'))
         .join('');
 
       // Insert main transaction
       const { error: txError } = await supabase
         .from('msr_ledger')
         .insert([{
           from_user_id: user.id,
           to_user_id: recipientId,
           amount: directAmount,
           transaction_type: 'DIRECT',
           description: sendForm.description || 'Transferencia MSR',
           hash,
           metadata: { splitApplied: true, originalAmount: amount },
         }]);
 
       if (txError) throw txError;
 
       playTransaction();
       playSuccess();
       toast.success(`Enviado ${amount} MSR exitosamente!`);
       
       setSendForm({ recipientEmail: '', amount: '', description: '' });
       setActiveTab('overview');
       refetch();
     } catch (err) {
       console.error('Transaction error:', err);
       toast.error('Error procesando la transacción');
       playError();
     } finally {
       setSending(false);
     }
   };
 
   return (
     <div className="space-y-6">
       {/* Header */}
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
             <Wallet className="w-6 h-6 text-primary" />
           </div>
           <div>
             <h1 className="text-2xl font-orbitron font-bold text-foreground">Wallet Nubi</h1>
             <p className="text-sm text-muted-foreground">Economía MSR • Quantum Split 70/20/10</p>
           </div>
         </div>
         <motion.button
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={refetch}
           className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
         >
           <RefreshCw className="w-5 h-5" />
         </motion.button>
       </div>
 
       {/* Tabs */}
       <div className="flex gap-2 p-1 bg-muted/30 rounded-xl">
         {[
           { id: 'overview', label: 'Resumen', icon: TrendingUp },
           { id: 'send', label: 'Enviar', icon: Send },
           { id: 'history', label: 'Historial', icon: History },
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
               activeTab === tab.id
                 ? 'bg-primary text-background'
                 : 'text-muted-foreground hover:text-foreground'
             }`}
           >
             <tab.icon className="w-4 h-4" />
             <span className="text-sm font-medium">{tab.label}</span>
           </button>
         ))}
       </div>
 
       {/* Content */}
       {activeTab === 'overview' && (
         <div className="space-y-6">
           <WalletBalanceCard balance={balance} loading={loading} />
            <EconomySplitVisualizer splits={splits} loading={loading} />
         </div>
       )}
 
       {activeTab === 'send' && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="p-6 rounded-2xl bg-card border border-primary/20"
         >
           <h3 className="text-lg font-orbitron font-bold text-foreground mb-4 flex items-center gap-2">
             <Send className="w-5 h-5 text-primary" />
             Enviar MSR
           </h3>
 
           <div className="space-y-4">
             <div>
               <label className="block text-sm text-muted-foreground mb-1">Destinatario (User ID)</label>
               <input
                 type="text"
                 value={sendForm.recipientEmail}
                 onChange={e => setSendForm(prev => ({ ...prev, recipientEmail: e.target.value }))}
                 placeholder="uuid del usuario..."
                 className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
               />
             </div>
 
             <div>
               <label className="block text-sm text-muted-foreground mb-1">Cantidad MSR</label>
               <input
                 type="number"
                 value={sendForm.amount}
                 onChange={e => setSendForm(prev => ({ ...prev, amount: e.target.value }))}
                 placeholder="0.00"
                 min="0"
                 step="0.01"
                 className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
               />
               <p className="text-xs text-muted-foreground mt-1">
                 Balance disponible: {balance.toFixed(2)} MSR
               </p>
             </div>
 
             <div>
               <label className="block text-sm text-muted-foreground mb-1">Descripción (opcional)</label>
               <input
                 type="text"
                 value={sendForm.description}
                 onChange={e => setSendForm(prev => ({ ...prev, description: e.target.value }))}
                 placeholder="Motivo de la transferencia..."
                 className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
               />
             </div>
 
             {/* Split Preview */}
             {sendForm.amount && parseFloat(sendForm.amount) > 0 && (
               <div className="p-4 rounded-xl bg-muted/30 border border-border">
                 <p className="text-sm text-muted-foreground mb-2">División Quantum-Split:</p>
                 <div className="grid grid-cols-3 gap-2 text-center">
                   <div className="p-2 rounded-lg bg-primary/20">
                     <p className="text-xs text-muted-foreground">Directo (70%)</p>
                     <p className="font-orbitron font-bold text-primary">
                       {(parseFloat(sendForm.amount) * 0.7).toFixed(2)}
                     </p>
                   </div>
                   <div className="p-2 rounded-lg bg-fenix/20">
                     <p className="text-xs text-muted-foreground">Fénix (20%)</p>
                     <p className="font-orbitron font-bold text-fenix">
                       {(parseFloat(sendForm.amount) * 0.2).toFixed(2)}
                     </p>
                   </div>
                   <div className="p-2 rounded-lg bg-kernel/20">
                     <p className="text-xs text-muted-foreground">Kernel (10%)</p>
                     <p className="font-orbitron font-bold text-kernel">
                       {(parseFloat(sendForm.amount) * 0.1).toFixed(2)}
                     </p>
                   </div>
                 </div>
               </div>
             )}
 
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleSend}
               disabled={sending || !sendForm.recipientEmail || !sendForm.amount}
               className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-cyber-cyan text-background font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               {sending ? (
                 <>
                   <RefreshCw className="w-4 h-4 animate-spin" />
                   Procesando...
                 </>
               ) : (
                 <>
                   <Zap className="w-4 h-4" />
                   Enviar MSR
                 </>
               )}
             </motion.button>
           </div>
         </motion.div>
       )}
 
       {activeTab === 'history' && (
         <TransactionHistory transactions={transactions} loading={loading} />
       )}
     </div>
   );
 };