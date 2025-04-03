import type { Player } from '@/types/player/Player';

export interface ChipsCalculationResult {
  totalChips: number;
  initialValue: number;
}

export const useChipsCalculation = () => {
  const calculatePlayerChips = (player: Player, exchangeRate: number): ChipsCalculationResult => {
    const paymentsSum = player.exchanges?.reduce((sum, payment) => sum + payment.cashAmount, 0) || 0;
    const chipsValue = paymentsSum * exchangeRate;

    return {
      totalChips: chipsValue,
      initialValue: chipsValue,
    };
  };

  const calculateTotalChips = (players: Player[], exchangeRate: number): number => {
    return players.reduce((sum, player) =>
      sum + calculatePlayerChips(player, exchangeRate).totalChips, 0);
  };

  return {
    calculatePlayerChips,
    calculateTotalChips,
  };
};
