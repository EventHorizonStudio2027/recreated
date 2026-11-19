using System;
using UnityEngine;

namespace Recreated
{
    public sealed class Health : MonoBehaviour
    {
        [SerializeField] private float maximum = 100f;
        public float Maximum => maximum;
        public float Current { get; private set; }
        public bool IsDead => Current <= 0;
        public event Action<Health> Died;
        public event Action<Health, float> Damaged;
        private void Awake() => Current = maximum;
        public void Configure(float max)
        {
            maximum = Mathf.Max(1, max);
            Current = maximum;
        }
        public float Damage(float amount)
        {
            if (IsDead || amount <= 0) return 0;
            float actual = Mathf.Min(Current, amount);
            Current -= actual;
            Damaged?.Invoke(this, actual);
            if (IsDead) Died?.Invoke(this);
            return actual;
        }
        public float Heal(float amount)
        {
            if (amount <= 0 || IsDead) return 0;
            float actual = Mathf.Min(maximum - Current, amount);
            Current += actual;
            return actual;
        }
    }
}
