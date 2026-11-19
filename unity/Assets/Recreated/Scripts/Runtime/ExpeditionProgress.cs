using System;
using UnityEngine;

namespace Recreated
{
    [Serializable]
    public sealed class ExpeditionProgress
    {
        public const int CurrentVersion = 1;
        public int version = CurrentVersion;
        public int completedRuns;
        public int totalDefeats;
        public int earnedEchoes;
        public int bestChamber;
        public static ExpeditionProgress FromJson(string json)
        {
            if (string.IsNullOrWhiteSpace(json)) return new ExpeditionProgress();
            try
            {
                ExpeditionProgress data = JsonUtility.FromJson<ExpeditionProgress>(json);
                if (data == null || data.version != CurrentVersion) return new ExpeditionProgress();
                data.completedRuns = Mathf.Clamp(data.completedRuns, 0, 1000000);
                data.totalDefeats = Mathf.Clamp(data.totalDefeats, 0, 1000000);
                data.earnedEchoes = Mathf.Clamp(data.earnedEchoes, 0, 1000000);
                data.bestChamber = Mathf.Clamp(data.bestChamber, 0, 10);
                return data;
            }
            catch (Exception)
            {
                return new ExpeditionProgress();
            }
        }
        public string ToJson() => JsonUtility.ToJson(this);
        public void RecordClear(int chambers)
        {
            completedRuns = Mathf.Min(1000000, completedRuns + 1);
            earnedEchoes = Mathf.Min(1000000, earnedEchoes + 2);
            bestChamber = Mathf.Max(bestChamber, Mathf.Clamp(chambers, 0, 10));
        }
        public void RecordDefeat(int chamber)
        {
            totalDefeats = Mathf.Min(1000000, totalDefeats + 1);
            bestChamber = Mathf.Max(bestChamber, Mathf.Clamp(chamber, 0, 10));
        }
    }
}
