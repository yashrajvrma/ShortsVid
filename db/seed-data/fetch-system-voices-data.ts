// db/seed-data/system-voices.ts

interface FishAudioModelResponse {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  languages: string[];
  samples: Array<{
    title: string;
    text: string;
    task_id: string;
    audio: string;
  }>;
}

interface VoiceSeedData {
  name: string;
  description: string | null;
  service: "FISH_AUDIO";
  voiceVariant: "SYSTEM";
  voiceId: string;
  modelId: string;
  languageCode: string[];
  gender: string;
  tags: string[];
  audioUrl: string;
}

const MODEL_IDS: Record<string, string[]> = {
  en: [
    "acc8237220d8470985ec9be6c4c480a9",
    "5196af35f6ff4a0dbf541793fc9f2157",
    "03397b4c4be74759b72533b663fbd001",
    "d8a1340984ee4b63ad1ffae27a6a4339",
    "536d3a5e000945adb7038665781a4aca",
    "bf322df2096a46f18c579d0baa36f41d",
    "802e3bc2b27e49c2995d23ef70e6ac89",
    "d75c270eaee14c8aa1e9e980cc37cf1b",
    "79d0bd3e4e5444b18f7b6d89b5927bf1",
    "fb7ec16ca51a45a5a4db881244d7990a",
    "722523118ee94709b661502c76b016b7",
    "92a2600282e547f098b4a8de1bc9a44a",
    "933563129e564b19a115bedd57b7406a",
    "59e9dc1cb20c452584788a2690c80970",
    "6717a74323274cb296ea9a0da654c977",
    "b545c585f631496c914815291da4e893",
    "c2623f0c075b4492ac367989aee1576f",
  ],
  zh: [
    "918a8277663d476b95e2c4867da0f6a6",
    "ca8fb681ce2040958c15ede5eef86177",
    "8e51722f29c043d5828e24cbae5682e9",
    "21082ac382d945e29aea354e90380f11",
    "a616236f5e874bcd84fceae68410680f",
  ],
  de: [
    "71c095ed4c03459fb98500db63b88fbe",
    "90042f762dbf49baa2e7776d011eee6b",
    "40f470ff12064bf1897215b41819147c",
    "a20517d0d23048319e4ced960899187e",
    "88b18e0d81474a0ca08e2ea6f9df5ff4",
  ],
  ja: [
    "5161d41404314212af1254556477c17d",
    "63bc41e652214372b15d9416a30a60b4",
    "46745543e52548238593a3962be77e3a",
    "1fcb900b5ae349ab92ec33fe532b8ea1",
    "71bf4cb71cd44df6aa603d51db8f92ff",
  ],
  fr: [
    "a78a204111a5453bbd972183db60b1bf",
    "5f63c8657897428eac254dbf82926cc5",
    "4f2a0684dd0247dda68f339738c780e6",
    "7e327849fe89489387cb3e016c714834",
    "a288bdc744da4ad194921adad6863175",
  ],
  ru: [
    "f28d669a0eff409bbf07c4d3f12aabb3",
    "0a690dbeb3984a9f88cd39353880775f",
    "d61694f4ee5042aba2ffe11a9635d97e",
  ],
};

async function fetchModelData(
  modelId: string,
): Promise<FishAudioModelResponse> {
  const response = await fetch(`https://api.fish.audio/model/${modelId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch model ${modelId}: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

function transformToVoiceSeed(
  model: FishAudioModelResponse,
  voiceId: string,
): VoiceSeedData {
  return {
    name: model.title,
    description: model.description,
    service: "FISH_AUDIO",
    voiceVariant: "SYSTEM",
    voiceId,
    modelId: model._id,
    languageCode: model.languages,
    gender: model.tags[0],
    tags: model.tags,
    audioUrl: model.samples?.[0]?.audio ?? null,
  };
}

async function main() {
  console.log("Fetching voice data from Fish Audio API...\n");

  const voices: VoiceSeedData[] = [];
  let voiceCounter = 1;

  const languages = Object.keys(MODEL_IDS) as Array<keyof typeof MODEL_IDS>;

  for (const lang of languages) {
    const modelIds = MODEL_IDS[lang];
    console.log(`Processing ${lang.toUpperCase()} models...`);

    for (const modelId of modelIds) {
      try {
        console.log(`  Fetching model: ${modelId}`);
        const modelData = await fetchModelData(modelId);
        const voiceId = `s${voiceCounter}`;
        const voice = transformToVoiceSeed(modelData, voiceId);
        voices.push(voice);
        voiceCounter++;
        console.log(`    -> Created ${voiceId}: ${voice.name}`);
      } catch (error) {
        console.error(`    -> Error fetching model ${modelId}:`, error);
      }
    }
  }

  console.log(`\nTotal voices fetched: ${voices.length}`);
  console.log("\n--- Voice Seed Data JSON ---\n");
  console.log(JSON.stringify(voices, null, 2));
}

main().catch(console.error);
