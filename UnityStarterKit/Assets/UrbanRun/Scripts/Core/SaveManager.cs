using UnityEngine;

namespace UrbanRun
{
    public static class SaveManager
    {
        private const string BestScoreKey = "urbanrun.bestScore";
        private const string WaterKey = "urbanrun.water";
        private const string FuelKey = "urbanrun.fuel";
        public static int BestScore => PlayerPrefs.GetInt(BestScoreKey, 0);
        public static int TotalWater => PlayerPrefs.GetInt(WaterKey, 0);
        public static int TotalFuel => PlayerPrefs.GetInt(FuelKey, 0);

        public static void SaveRecord(int score)
        {
            if (score > BestScore) PlayerPrefs.SetInt(BestScoreKey, score);
            PlayerPrefs.Save();
        }
        public static void AddWater(int amount) { PlayerPrefs.SetInt(WaterKey, TotalWater + Mathf.Max(0, amount)); PlayerPrefs.Save(); }
        public static void AddFuel(int amount) { PlayerPrefs.SetInt(FuelKey, TotalFuel + Mathf.Max(0, amount)); PlayerPrefs.Save(); }
    }
}
