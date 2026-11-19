using UnityEngine;

namespace Recreated
{
    public static class ProgressStore
    {
        private const string Key = "Recreated.Unity.ExpeditionProgress.v1";
        public static ExpeditionProgress Load() => ExpeditionProgress.FromJson(PlayerPrefs.GetString(Key, ""));
        public static void Save(ExpeditionProgress progress)
        {
            if (progress == null) return;
            PlayerPrefs.SetString(Key, progress.ToJson());
            PlayerPrefs.Save();
        }
    }
}
