-- Enable realtime for msr_ledger to support live transaction updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.msr_ledger;