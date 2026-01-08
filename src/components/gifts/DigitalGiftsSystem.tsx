import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, Sparkles, Heart, Star, Crown, Gem, Rocket, 
  Zap, Flame, Music, X, Send, Coins 
} from 'lucide-react';

interface DigitalGift {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  animation: 'float' | 'burst' | 'spiral' | 'rain' | 'explosion';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  color: string;
}

const GIFTS: DigitalGift[] = [
  { id: 'rose', name: 'Rosa Digital', icon: <Heart className="w-8 h-8" />, price: 1, animation: 'float', rarity: 'common', color: 'text-pink-500' },
  { id: 'star', name: 'Estrella MSR', icon: <Star className="w-8 h-8" />, price: 5, animation: 'float', rarity: 'common', color: 'text-yellow-400' },
  { id: 'spark', name: 'Chispa Creativa', icon: <Sparkles className="w-8 h-8" />, price: 10, animation: 'burst', rarity: 'rare', color: 'text-primary' },
  { id: 'gem', name: 'Gema Soberana', icon: <Gem className="w-8 h-8" />, price: 50, animation: 'spiral', rarity: 'rare', color: 'text-purple-400' },
  { id: 'rocket', name: 'Cohete TAMV', icon: <Rocket className="w-8 h-8" />, price: 100, animation: 'burst', rarity: 'epic', color: 'text-orange-500' },
  { id: 'flame', name: 'Fuego Fénix', icon: <Flame className="w-8 h-8" />, price: 200, animation: 'explosion', rarity: 'epic', color: 'text-fenix-orange' },
  { id: 'zap', name: 'Rayo Cuántico', icon: <Zap className="w-8 h-8" />, price: 500, animation: 'rain', rarity: 'legendary', color: 'text-primary' },
  { id: 'crown', name: 'Corona Isabella', icon: <Crown className="w-8 h-8" />, price: 1000, animation: 'explosion', rarity: 'legendary', color: 'text-secondary' },
  { id: 'music', name: 'Melodía Eterna', icon: <Music className="w-8 h-8" />, price: 2000, animation: 'spiral', rarity: 'mythic', color: 'text-isabella-purple' },
  { id: 'universe', name: 'Universo TAMV', icon: <Sparkles className="w-8 h-8" />, price: 5000, animation: 'explosion', rarity: 'mythic', color: 'text-gradient-sovereign' },
];

interface GiftAnimationProps {
  gift: DigitalGift;
  onComplete: () => void;
}

const GiftAnimation = ({ gift, onComplete }: GiftAnimationProps) => {
  const renderAnimation = () => {
    switch (gift.animation) {
      case 'float':
        return (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0 }}
            animate={{ y: -200, opacity: [0, 1, 1, 0], scale: [0, 1.5, 1.5, 0] }}
            transition={{ duration: 2, ease: "easeOut" }}
            onAnimationComplete={onComplete}
            className={`absolute left-1/2 top-1/2 ${gift.color}`}
          >
            {gift.icon}
          </motion.div>
        );
      case 'burst':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: i * 45 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * 45) * Math.PI / 180) * 150,
                  y: Math.sin((i * 45) * Math.PI / 180) * 150,
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 1.5, delay: i * 0.05 }}
                onAnimationComplete={i === 7 ? onComplete : undefined}
                className={`absolute ${gift.color}`}
              >
                {gift.icon}
              </motion.div>
            ))}
          </div>
        );
      case 'spiral':
        return (
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 2, 0],
              rotate: [0, 720],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2 }}
            onAnimationComplete={onComplete}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${gift.color}`}
          >
            {gift.icon}
          </motion.div>
        );
      case 'rain':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -50, x: Math.random() * 400 - 200, opacity: 0 }}
                animate={{ 
                  y: 500,
                  opacity: [0, 1, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{ 
                  duration: 2,
                  delay: Math.random() * 0.5,
                  ease: "easeIn"
                }}
                onAnimationComplete={i === 19 ? onComplete : undefined}
                className={`absolute ${gift.color}`}
                style={{ left: `${Math.random() * 100}%` }}
              >
                {gift.icon}
              </motion.div>
            ))}
          </div>
        );
      case 'explosion':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 3, 0] }}
              transition={{ duration: 1 }}
              className={`absolute ${gift.color} opacity-20`}
            >
              <div className="w-40 h-40 rounded-full bg-current" />
            </motion.div>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * 30) * Math.PI / 180) * 200,
                  y: Math.sin((i * 30) * Math.PI / 180) * 200,
                  rotate: [0, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 1.5, delay: 0.2 + i * 0.03 }}
                onAnimationComplete={i === 11 ? onComplete : undefined}
                className={`absolute ${gift.color}`}
              >
                {gift.icon}
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2.5, 2], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5 }}
              className={`absolute text-6xl ${gift.color}`}
            >
              {gift.icon}
            </motion.div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
    >
      {renderAnimation()}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-32 text-center"
      >
        <p className="text-2xl font-bold text-white">
          <span className={gift.color}>{gift.name}</span>
        </p>
        <p className="text-lg text-primary font-semibold mt-1">+{gift.price} MSR</p>
      </motion.div>
    </motion.div>
  );
};

interface DigitalGiftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  onSendGift: (gift: DigitalGift) => void;
}

export const DigitalGiftsModal = ({ isOpen, onClose, recipientName, onSendGift }: DigitalGiftsModalProps) => {
  const [selectedGift, setSelectedGift] = useState<DigitalGift | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showAnimation, setShowAnimation] = useState<DigitalGift | null>(null);

  const getRarityStyles = (rarity: DigitalGift['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/30 bg-gray-500/5';
      case 'rare': return 'border-blue-500/30 bg-blue-500/10';
      case 'epic': return 'border-purple-500/30 bg-purple-500/10';
      case 'legendary': return 'border-secondary/30 bg-secondary/10';
      case 'mythic': return 'border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10';
    }
  };

  const handleSend = () => {
    if (selectedGift) {
      setShowAnimation(selectedGift);
      onSendGift(selectedGift);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showAnimation && (
          <GiftAnimation 
            gift={showAnimation} 
            onComplete={() => setShowAnimation(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={onClose}
          >
            <motion.div
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 300, opacity: 0 }}
              className="w-full max-w-2xl max-h-[80vh] bg-card rounded-t-3xl sm:rounded-3xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 p-4 bg-card/95 backdrop-blur-xl border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-orbitron text-foreground">Enviar Regalo</h2>
                  <p className="text-sm text-muted-foreground">Para: <span className="text-primary">{recipientName}</span></p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>

              {/* Gifts Grid */}
              <div className="p-4 overflow-y-auto max-h-[50vh]">
                <div className="grid grid-cols-5 gap-3">
                  {GIFTS.map((gift) => (
                    <motion.button
                      key={gift.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedGift(gift)}
                      className={`relative p-3 rounded-2xl border-2 transition-all ${
                        getRarityStyles(gift.rarity)
                      } ${selectedGift?.id === gift.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                    >
                      <div className={`flex flex-col items-center gap-2 ${gift.color}`}>
                        {gift.icon}
                        <span className="text-[10px] font-medium text-foreground truncate w-full text-center">{gift.name}</span>
                        <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                          <Coins className="w-3 h-3" />
                          {gift.price}
                        </div>
                      </div>
                      {gift.rarity === 'mythic' && (
                        <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gradient-to-r from-primary to-secondary rounded-full text-[8px] font-bold text-primary-foreground uppercase">
                          Mítico
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 p-4 bg-card/95 backdrop-blur-xl border-t border-border">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold hover:bg-muted/80"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold hover:bg-muted/80"
                    >
                      +
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSend}
                    disabled={!selectedGift}
                    className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                      selectedGift 
                        ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                    <span>
                      {selectedGift 
                        ? `Enviar ${quantity}x (${(selectedGift.price * quantity).toLocaleString()} MSR)` 
                        : 'Selecciona un regalo'}
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const GiftButton = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25"
  >
    <Gift className="w-6 h-6" />
  </motion.button>
);
