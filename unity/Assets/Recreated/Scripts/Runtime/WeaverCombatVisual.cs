using UnityEngine;

namespace Recreated
{
    [RequireComponent(typeof(PlayerController))]
    public sealed class WeaverCombatVisual : MonoBehaviour
    {
        private PlayerController player;
        private Transform blade;
        private Transform mantle;
        private Vector3 bladeRest;
        private Quaternion bladeRotation;
        private Quaternion mantleRest;
        private void Awake()
        {
            player = GetComponent<PlayerController>();
            blade = transform.Find("Weaver — gilded blade");
            mantle = transform.Find("Weaver — midnight mantle");
            if (blade != null)
            {
                bladeRest = blade.localPosition;
                bladeRotation = blade.localRotation;
            }
            if (mantle != null) mantleRest = mantle.localRotation;
        }
        private void LateUpdate()
        {
            if (blade != null)
            {
                float t = player.AttackAnimation01;
                float swing = t < 1f ? Mathf.Sin(t * Mathf.PI) : 0f;
                blade.localRotation = bladeRotation * Quaternion.Euler(0, -105f * swing, 12f * swing);
                blade.localPosition = bladeRest + new Vector3(.1f * swing, 0, .25f * swing);
            }
            if (mantle != null)
            {
                float sway = Mathf.Sin(Time.time * 3.4f) * (player.IsDodging ? 14f : 3f);
                mantle.localRotation = mantleRest * Quaternion.Euler(sway, 0, 0);
            }
        }
    }
}
