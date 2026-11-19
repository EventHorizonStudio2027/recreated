using NUnit.Framework;

namespace Recreated.Tests
{
    public sealed class ProgressTests
    {
        [Test] public void CorruptedDataFallsBackSafely()
        {
            Assert.AreEqual(0, ExpeditionProgress.FromJson("not json").completedRuns);
            Assert.AreEqual(0, ExpeditionProgress.FromJson("").earnedEchoes);
        }
        [Test] public void ProgressRoundTripKeepsRewards()
        {
            var data = new ExpeditionProgress();
            data.RecordClear(3);
            data.RecordDefeat(2);
            var restored = ExpeditionProgress.FromJson(data.ToJson());
            Assert.AreEqual(1, restored.completedRuns);
            Assert.AreEqual(1, restored.totalDefeats);
            Assert.AreEqual(2, restored.earnedEchoes);
            Assert.AreEqual(3, restored.bestChamber);
        }
        [Test] public void InvalidCountersAreClamped()
        {
            var restored = ExpeditionProgress.FromJson("{\"version\":1,\"completedRuns\":-50,\"earnedEchoes\":999999999}");
            Assert.AreEqual(0, restored.completedRuns);
            Assert.AreEqual(1000000, restored.earnedEchoes);
        }
    }
}
