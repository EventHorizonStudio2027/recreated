using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.SceneManagement;

namespace Recreated.Editor
{
    public static class PrototypeSceneBuilder
    {
        private const string ScenePath = "Assets/Recreated/Scenes/Prototype.unity";

        // Unity -batchmode -projectPath unity -executeMethod Recreated.Editor.PrototypeSceneBuilder.GenerateBatch
        public static void GenerateBatch()
        {
            Generate();
            AssetDatabase.Refresh();
            if (!File.Exists(ScenePath))
                throw new IOException("Recreated scene generation failed: " + ScenePath);
            Debug.Log("RECREATED_SCENE_READY: " + ScenePath);
        }

        [MenuItem("Recreated/Open Prototype Scene")]
        public static void OpenPrototype()
        {
            if (!File.Exists(ScenePath))
            {
                Generate();
                return;
            }
            if (!EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo())
                return;
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
        }

        [MenuItem("Recreated/Generate Prototype Scene")]
        public static void Generate()
        {
            if (!Directory.Exists("Assets/Recreated/Scenes")) Directory.CreateDirectory("Assets/Recreated/Scenes");
            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            GameObject light = new GameObject("Sun — soft directional light");
            Light sun = light.AddComponent<Light>();
            sun.type = LightType.Directional;
            sun.intensity = 1.25f;
            sun.color = new Color(1f, .88f, .74f);
            light.transform.rotation = Quaternion.Euler(48, -25, 0);

            GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Plane);
            floor.name = "Mire — procedural ground";
            floor.transform.localScale = new Vector3(4, 1, 4);
            floor.GetComponent<Renderer>().sharedMaterial = MakeMaterial("Mire Ground", new Color(.12f, .23f, .2f));
            Material stone = MakeMaterial("Ruins Stone", new Color(.26f, .34f, .36f));
            Material ember = MakeMaterial("Ember Gold", new Color(.95f, .55f, .2f));
            Material moss = MakeMaterial("Moss", new Color(.14f, .31f, .24f));

            for (int i = 0; i < 18; i++)
            {
                float angle = i * Mathf.PI * 2 / 18f;
                GameObject pillar = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                pillar.name = "Mire — ruin marker " + (i + 1);
                pillar.transform.position = new Vector3(Mathf.Cos(angle) * 16, .8f, Mathf.Sin(angle) * 16);
                pillar.transform.localScale = new Vector3(.65f, .8f + (i % 3) * .3f, .65f);
                pillar.GetComponent<Renderer>().sharedMaterial = stone;
                pillar.transform.rotation = Quaternion.Euler(0, i * 19, (i % 3 - 1) * 7);
                if (i % 3 == 0)
                {
                    GameObject lantern = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                    lantern.name = "Mire — lantern " + i;
                    lantern.transform.position = pillar.transform.position + Vector3.up * (1.6f + (i % 3) * .6f);
                    lantern.transform.localScale = Vector3.one * .36f;
                    lantern.GetComponent<Renderer>().sharedMaterial = ember;
                    Object.DestroyImmediate(lantern.GetComponent<SphereCollider>());
                    Light glow = lantern.AddComponent<Light>();
                    glow.type = LightType.Point;
                    glow.range = 5f;
                    glow.intensity = 1.4f;
                    glow.color = new Color(1f, .57f, .26f);
                }
            }

            for (int i = 0; i < 24; i++)
            {
                float angle = i * 2.399963f;
                float radius = 4f + (i % 6) * 2.2f;
                GameObject tuft = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                tuft.name = "Mire — moss cluster " + i;
                tuft.transform.position = new Vector3(Mathf.Cos(angle) * radius, .06f, Mathf.Sin(angle) * radius);
                tuft.transform.localScale = new Vector3(.65f + (i % 3) * .2f, .06f, .65f);
                tuft.GetComponent<Renderer>().sharedMaterial = moss;
                Object.DestroyImmediate(tuft.GetComponent<CapsuleCollider>());
            }
            GameObject player = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            player.name = "Weaver — playable";
            player.transform.position = new Vector3(0, 1, 0);
            Object.DestroyImmediate(player.GetComponent<CapsuleCollider>());
            player.GetComponent<Renderer>().sharedMaterial = MakeMaterial("Weaver Armour", new Color(.34f, .48f, .6f));
            player.AddComponent<CharacterController>();
            player.AddComponent<Health>();
            PlayerController controller = player.AddComponent<PlayerController>();
            player.AddComponent<DamageFlash>();
            GameObject visor = GameObject.CreatePrimitive(PrimitiveType.Cube);
            visor.name = "Weaver — glowing visor";
            visor.transform.SetParent(player.transform, false);
            visor.transform.localPosition = new Vector3(0, .38f, .48f);
            visor.transform.localScale = new Vector3(.65f, .12f, .1f);
            Object.DestroyImmediate(visor.GetComponent<BoxCollider>());
            visor.GetComponent<Renderer>().sharedMaterial = MakeMaterial("Visor Gold", new Color(.95f, .76f, .4f));
            GameObject mantle = GameObject.CreatePrimitive(PrimitiveType.Cube);
            mantle.name = "Weaver — midnight mantle";
            mantle.transform.SetParent(player.transform, false);
            mantle.transform.localPosition = new Vector3(0, -.15f, -.34f);
            mantle.transform.localScale = new Vector3(.94f, 1.28f, .22f);
            Object.DestroyImmediate(mantle.GetComponent<BoxCollider>());
            mantle.GetComponent<Renderer>().sharedMaterial = MakeMaterial("Mantle Indigo", new Color(.13f, .16f, .29f));
            GameObject blade = GameObject.CreatePrimitive(PrimitiveType.Cube);
            blade.name = "Weaver — gilded blade";
            blade.transform.SetParent(player.transform, false);
            blade.transform.localPosition = new Vector3(.62f, -.12f, .48f);
            blade.transform.localScale = new Vector3(.14f, .14f, 1.4f);
            Object.DestroyImmediate(blade.GetComponent<BoxCollider>());
            blade.GetComponent<Renderer>().sharedMaterial = MakeMaterial("Blade Steel", new Color(.72f, .81f, .86f));
            player.AddComponent<WeaverCombatVisual>();
            player.AddComponent<EchoPulseVisual>();

            GameObject cameraObject = new GameObject("Camera — 2.5D orthographic");
            Camera camera = cameraObject.AddComponent<Camera>();
            cameraObject.tag = "MainCamera";
            camera.orthographic = true;
            camera.orthographicSize = 13;
            camera.backgroundColor = new Color(.07f, .1f, .16f);
            camera.clearFlags = CameraClearFlags.SolidColor;
            cameraObject.transform.position = new Vector3(0, 22, -18);
            cameraObject.transform.rotation = Quaternion.Euler(52, 0, 0);
            cameraObject.AddComponent<AudioListener>();
            FollowCamera follow = cameraObject.AddComponent<FollowCamera>();
            follow.target = player.transform;

            GameObject director = new GameObject("Expedition — waves and HUD");
            ExpeditionDirector expedition = director.AddComponent<ExpeditionDirector>();
            expedition.player = controller;

            if (!EditorSceneManager.SaveScene(scene, ScenePath))
                throw new IOException("Failed to save Recreated prototype scene: " + ScenePath);
            EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };
            AssetDatabase.SaveAssets();
            Debug.Log("Recreated: generated playable 2.5D prototype at " + ScenePath);
        }

        private static Material MakeMaterial(string name, Color color)
        {
            const string root = "Assets/Recreated/Materials";
            if (!Directory.Exists(root)) Directory.CreateDirectory(root);
            string path = root + "/" + name.Replace(' ', '_') + ".mat";
            Material existing = AssetDatabase.LoadAssetAtPath<Material>(path);
            if (existing != null) return existing;
            Shader shader = Shader.Find("Universal Render Pipeline/Lit");
            if (shader == null) shader = Shader.Find("Standard");
            Material material = new Material(shader) { name = name, color = color };
            AssetDatabase.CreateAsset(material, path);
            return material;
        }
    }
}
