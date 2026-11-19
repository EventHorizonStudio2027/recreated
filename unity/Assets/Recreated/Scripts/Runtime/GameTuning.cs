using System;
using UnityEngine;

namespace Recreated
{
    [Serializable]
    public class GameTuning
    {
        public float moveSpeed = 6f;
        public float dodgeSpeed = 14f;
        public float dodgeDuration = .18f;
        public float dodgeCooldown = .65f;
        public float attackRadius = 2.1f;
        public float attackCooldown = .35f;
        public float attackDamage = 26f;
        public float pulseRadius = 5f;
        public float pulseCooldown = 5f;
        public float pulseDamage = 34f;
        public float enemySpeed = 2.4f;
        public float enemyHealth = 65f;
        public float enemyDamage = 8f;
        public float enemyAttackCooldown = 1.2f;
        public float playerHealth = 100f;
        public int waveSize = 5;
        public int wavesPerExpedition = 3;
        public static GameTuning Default => new GameTuning();
        public void Validate()
        {
            moveSpeed = Mathf.Max(.1f, moveSpeed);
            dodgeSpeed = Mathf.Max(moveSpeed, dodgeSpeed);
            dodgeDuration = Mathf.Clamp(dodgeDuration, .05f, .5f);
            dodgeCooldown = Mathf.Max(dodgeDuration, dodgeCooldown);
            attackRadius = Mathf.Max(.1f, attackRadius);
            attackCooldown = Mathf.Max(.05f, attackCooldown);
            pulseRadius = Mathf.Max(attackRadius, pulseRadius);
            pulseCooldown = Mathf.Max(.1f, pulseCooldown);
            enemySpeed = Mathf.Max(.1f, enemySpeed);
            enemyHealth = Mathf.Max(1f, enemyHealth);
            playerHealth = Mathf.Max(1f, playerHealth);
            waveSize = Mathf.Clamp(waveSize, 1, 30);
            wavesPerExpedition = Mathf.Clamp(wavesPerExpedition, 1, 10);
        }
    }
}
