using NUnit.Framework;
using UnityEngine;

namespace Recreated.Tests
{
    public class HealthTests
    {
        private GameObject obj;
        private Health health;
        [SetUp] public void Setup()
        {
            obj = new GameObject("Test Health");
            health = obj.AddComponent<Health>();
            health.Configure(100);
        }
        [TearDown] public void Teardown() => Object.DestroyImmediate(obj);
        [Test] public void DamageClampsToZero()
        {
            Assert.AreEqual(100, health.Damage(300));
            Assert.IsTrue(health.IsDead);
            Assert.AreEqual(0, health.Current);
        }
        [Test] public void HealClampsToMaximum()
        {
            health.Damage(40);
            Assert.AreEqual(40, health.Heal(500));
            Assert.AreEqual(100, health.Current);
        }
        [Test] public void DeathEventFiresOnce()
        {
            int deaths = 0;
            health.Died += _ => deaths++;
            health.Damage(100);
            health.Damage(50);
            Assert.AreEqual(1, deaths);
        }
        [Test] public void TuningClampsInvalidValues()
        {
            var tuning = new GameTuning { moveSpeed = -1, waveSize = 100, attackCooldown = 0 };
            tuning.Validate();
            Assert.Greater(tuning.moveSpeed, 0);
            Assert.AreEqual(30, tuning.waveSize);
            Assert.Greater(tuning.attackCooldown, 0);
        }
    }
}
