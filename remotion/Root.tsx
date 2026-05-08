// remotion\Root.tsx
//
// ALL compositions are registered here — Remotion bundles everything once.
// Server-side rendering picks the right composition via compositionId:
//   "renderVideo"             → faceless / AI-image shorts
//   "renderConversationVideo" → dual-speaker conversation videos

import React from "react";
import RemotionComposition from "../components/remotion/remotion-composition";
import ConversationVideoComposition from "../components/remotion/conversation/conversation-composition";
import { Composition, CalculateMetadataFunction } from "remotion";
import { ShortsVideo, ConversationVideo } from "../types";

// ─── Faceless video props type ────────────────────────────────────────────────
type FacelessRootProps = {
  videoData: ShortsVideo;
};

// ─── Conversation video props type ───────────────────────────────────────────
type ConversationRootProps = {
  videoData: ConversationVideo;
};

// const videoData = {
//   id: "cmn4mis7m000gsgl982yao0tx",
//   status: "SUCCESS",
//   videoStyle: "CINEMATIC",
//   duration: 56,
//   script: {
//     id: "cmn4mirur000esgl9c5kxva32",
//     languageCode: "en",
//     topic: "HISTORY_FACTS",
//     prompt: "how america reached moon",
//     content: [
//       "In 1961, the United States set an insane goal: landing humans on the moon by the end of the decade. It sounded impossible.",
//       "The Cold War was intense. The space race? Even more. John F. Kennedy's voice echoed: 'We choose to go to the moon not because it is easy, but because it is hard.'",
//       "Scientists at NASA scrambled. Computers as big as rooms. Calculations by hand. Every misstep meant death in space.",
//       'In 1969, tension peaked. Broadcast live, millions held their breath. Neil Armstrong\'s heartbeat was racing as he descended the ladder. "The Eagle has landed," he announced.',
//       "Then, that historic moment: 'That's one small step for man, one giant leap for mankind.' The world erupted in cheers, tears.",
//       "America made it. But the real impact? A leap in technology, shifting how we live today. From tiny computers to GPS, all from a moment born out of competition and courage.",
//     ],
//   },
//   voice: {
//     id: "cmmib8d0q0004dcl9eri5v2tl",
//     name: "Ethan",
//     gender: "male",
//     languageCode: ["en"],
//   },
//   captionConfig: {
//     id: "cmn4mis10000fsgl9ny8s8kpw",
//     name: null,
//     textColor: "#FFFFFF",
//     strokeColor: "#000000",
//     highlightColor: "#FFFFFF",
//     highlightStrokeColor: "transparent",
//     popBackgroundColor: "#6C3CF7",
//     strokeWidth: 0.2,
//     fontSize: 85,
//     verticalPosition: 80,
//     horizontalPosition: 50,
//     maxLines: 2,
//     maxWordsPerLine: 2,
//     shadowOffsetY: 0,
//     shadowBlur: 0,
//     fontFamily: "Montserrat",
//     fontWeight: "800",
//     textTransform: "none",
//     letterSpacing: 0,
//     animationPreset: "pop",
//     lightLeakHue: 240,
//     lightLeakSeed: 3,
//     createdAt: "2026-03-24T13:01:36.228Z",
//     updatedAt: "2026-03-24T13:01:36.228Z",
//   },
//   caption: {
//     words: [
//       {
//         end: 0.3199999928474426,
//         word: "In",
//         start: 0,
//       },
//       {
//         end: 1.2999999523162842,
//         word: "1961",
//         start: 0.3199999928474426,
//       },
//       {
//         end: 1.840000033378601,
//         word: "the",
//         start: 1.7599999904632568,
//       },
//       {
//         end: 2.240000009536743,
//         word: "United",
//         start: 1.840000033378601,
//       },
//       {
//         end: 2.440000057220459,
//         word: "States",
//         start: 2.240000009536743,
//       },
//       {
//         end: 2.680000066757202,
//         word: "set",
//         start: 2.440000057220459,
//       },
//       {
//         end: 2.9000000953674316,
//         word: "an",
//         start: 2.680000066757202,
//       },
//       {
//         end: 3.2200000286102295,
//         word: "insane",
//         start: 2.9000000953674316,
//       },
//       {
//         end: 3.5799999237060547,
//         word: "goal",
//         start: 3.2200000286102295,
//       },
//       {
//         end: 4.28000020980835,
//         word: "landing",
//         start: 4.28000020980835,
//       },
//       {
//         end: 4.619999885559082,
//         word: "humans",
//         start: 4.28000020980835,
//       },
//       {
//         end: 4.800000190734863,
//         word: "on",
//         start: 4.619999885559082,
//       },
//       {
//         end: 5.079999923706055,
//         word: "the",
//         start: 4.800000190734863,
//       },
//       {
//         end: 5.079999923706055,
//         word: "moon",
//         start: 5.079999923706055,
//       },
//       {
//         end: 5.260000228881836,
//         word: "by",
//         start: 5.079999923706055,
//       },
//       {
//         end: 5.559999942779541,
//         word: "the",
//         start: 5.260000228881836,
//       },
//       {
//         end: 5.599999904632568,
//         word: "end",
//         start: 5.559999942779541,
//       },
//       {
//         end: 5.71999979019165,
//         word: "of",
//         start: 5.599999904632568,
//       },
//       {
//         end: 5.920000076293945,
//         word: "the",
//         start: 5.71999979019165,
//       },
//       {
//         end: 6.199999809265137,
//         word: "decade",
//         start: 5.679999828338623,
//       },
//       {
//         end: 7.019999980926514,
//         word: "It",
//         start: 6.800000190734863,
//       },
//       {
//         end: 7.239999771118164,
//         word: "sounded",
//         start: 7.019999980926514,
//       },
//       {
//         end: 7.860000133514404,
//         word: "impossible",
//         start: 7.239999771118164,
//       },
//       {
//         end: 8.600000381469727,
//         word: "The",
//         start: 8.479999542236328,
//       },
//       {
//         end: 8.960000038146973,
//         word: "Cold",
//         start: 8.600000381469727,
//       },
//       {
//         end: 9.020000457763672,
//         word: "War",
//         start: 8.960000038146973,
//       },
//       {
//         end: 9.279999732971191,
//         word: "was",
//         start: 9.020000457763672,
//       },
//       {
//         end: 9.680000305175781,
//         word: "intense",
//         start: 9.279999732971191,
//       },
//       {
//         end: 10.359999656677246,
//         word: "The",
//         start: 10.199999809265137,
//       },
//       {
//         end: 10.680000305175781,
//         word: "space",
//         start: 10.359999656677246,
//       },
//       {
//         end: 10.960000038146973,
//         word: "race",
//         start: 10.680000305175781,
//       },
//       {
//         end: 11.680000305175781,
//         word: "Even",
//         start: 11.479999542236328,
//       },
//       {
//         end: 12,
//         word: "more",
//         start: 11.680000305175781,
//       },
//       {
//         end: 12.84000015258789,
//         word: "John",
//         start: 12.5600004196167,
//       },
//       {
//         end: 13.100000381469727,
//         word: "F",
//         start: 12.84000015258789,
//       },
//       {
//         end: 13.4399995803833,
//         word: "Kennedy's",
//         start: 13.220000267028809,
//       },
//       {
//         end: 13.619999885559082,
//         word: "voice",
//         start: 13.4399995803833,
//       },
//       {
//         end: 14.199999809265137,
//         word: "echoed",
//         start: 13.619999885559082,
//       },
//       {
//         end: 14.539999961853027,
//         word: "We",
//         start: 14.399999618530273,
//       },
//       {
//         end: 14.84000015258789,
//         word: "choose",
//         start: 14.539999961853027,
//       },
//       {
//         end: 15.020000457763672,
//         word: "to",
//         start: 14.84000015258789,
//       },
//       {
//         end: 15.119999885559082,
//         word: "go",
//         start: 15.020000457763672,
//       },
//       {
//         end: 15.220000267028809,
//         word: "to",
//         start: 15.119999885559082,
//       },
//       {
//         end: 15.5600004196167,
//         word: "the",
//         start: 15.220000267028809,
//       },
//       {
//         end: 15.5600004196167,
//         word: "moon",
//         start: 15.5600004196167,
//       },
//       {
//         end: 15.819999694824219,
//         word: "not",
//         start: 15.5600004196167,
//       },
//       {
//         end: 16.059999465942383,
//         word: "because",
//         start: 15.819999694824219,
//       },
//       {
//         end: 16.18000030517578,
//         word: "it",
//         start: 16.059999465942383,
//       },
//       {
//         end: 16.360000610351562,
//         word: "is",
//         start: 16.18000030517578,
//       },
//       {
//         end: 16.6200008392334,
//         word: "easy",
//         start: 16.360000610351562,
//       },
//       {
//         end: 16.81999969482422,
//         word: "but",
//         start: 16.6200008392334,
//       },
//       {
//         end: 17.079999923706055,
//         word: "because",
//         start: 16.81999969482422,
//       },
//       {
//         end: 17.200000762939453,
//         word: "it",
//         start: 17.079999923706055,
//       },
//       {
//         end: 17.420000076293945,
//         word: "is",
//         start: 17.200000762939453,
//       },
//       {
//         end: 17.700000762939453,
//         word: "hard",
//         start: 17.420000076293945,
//       },
//       {
//         end: 18.65999984741211,
//         word: "Scientists",
//         start: 18.65999984741211,
//       },
//       {
//         end: 18.920000076293945,
//         word: "at",
//         start: 18.65999984741211,
//       },
//       {
//         end: 19.200000762939453,
//         word: "NASA",
//         start: 18.920000076293945,
//       },
//       {
//         end: 19.68000030517578,
//         word: "scrambled",
//         start: 19.200000762939453,
//       },
//       {
//         end: 20.68000030517578,
//         word: "Computers",
//         start: 20.540000915527344,
//       },
//       {
//         end: 20.920000076293945,
//         word: "as",
//         start: 20.68000030517578,
//       },
//       {
//         end: 21.020000457763672,
//         word: "big",
//         start: 20.920000076293945,
//       },
//       {
//         end: 21.579999923706055,
//         word: "as",
//         start: 21.020000457763672,
//       },
//       {
//         end: 21.579999923706055,
//         word: "rooms",
//         start: 21.579999923706055,
//       },
//       {
//         end: 22.6200008392334,
//         word: "Calculations",
//         start: 22.200000762939453,
//       },
//       {
//         end: 22.940000534057617,
//         word: "by",
//         start: 22.6200008392334,
//       },
//       {
//         end: 23.260000228881836,
//         word: "hand",
//         start: 22.940000534057617,
//       },
//       {
//         end: 23.940000534057617,
//         word: "Every",
//         start: 23.260000228881836,
//       },
//       {
//         end: 24.420000076293945,
//         word: "misstep",
//         start: 23.940000534057617,
//       },
//       {
//         end: 24.700000762939453,
//         word: "meant",
//         start: 24.420000076293945,
//       },
//       {
//         end: 24.940000534057617,
//         word: "death",
//         start: 24.700000762939453,
//       },
//       {
//         end: 25.6200008392334,
//         word: "in",
//         start: 24.940000534057617,
//       },
//       {
//         end: 25.6200008392334,
//         word: "space",
//         start: 25.6200008392334,
//       },
//       {
//         end: 26.200000762939453,
//         word: "In",
//         start: 26.1200008392334,
//       },
//       {
//         end: 27.200000762939453,
//         word: "1969",
//         start: 26.200000762939453,
//       },
//       {
//         end: 27.639999389648438,
//         word: "tension",
//         start: 27.3799991607666,
//       },
//       {
//         end: 28.020000457763672,
//         word: "peaked",
//         start: 27.639999389648438,
//       },
//       {
//         end: 28.899999618530273,
//         word: "Broadcast",
//         start: 28.65999984741211,
//       },
//       {
//         end: 29.31999969482422,
//         word: "live",
//         start: 28.899999618530273,
//       },
//       {
//         end: 30,
//         word: "millions",
//         start: 29.760000228881836,
//       },
//       {
//         end: 30.239999771118164,
//         word: "held",
//         start: 30,
//       },
//       {
//         end: 30.760000228881836,
//         word: "their",
//         start: 30.239999771118164,
//       },
//       {
//         end: 30.799999237060547,
//         word: "breath",
//         start: 30.760000228881836,
//       },
//       {
//         end: 31.540000915527344,
//         word: "Neil",
//         start: 31.440000534057617,
//       },
//       {
//         end: 32.2400016784668,
//         word: "Armstrong's",
//         start: 31.540000915527344,
//       },
//       {
//         end: 32.380001068115234,
//         word: "heartbeat",
//         start: 32.2400016784668,
//       },
//       {
//         end: 32.70000076293945,
//         word: "was",
//         start: 32.380001068115234,
//       },
//       {
//         end: 32.97999954223633,
//         word: "racing",
//         start: 32.70000076293945,
//       },
//       {
//         end: 33.13999938964844,
//         word: "as",
//         start: 32.97999954223633,
//       },
//       {
//         end: 33.41999816894531,
//         word: "he",
//         start: 33.13999938964844,
//       },
//       {
//         end: 33.599998474121094,
//         word: "descended",
//         start: 33.41999816894531,
//       },
//       {
//         end: 34.15999984741211,
//         word: "the",
//         start: 33.599998474121094,
//       },
//       {
//         end: 34.15999984741211,
//         word: "ladder",
//         start: 34.15999984741211,
//       },
//       {
//         end: 34.81999969482422,
//         word: "The",
//         start: 34.400001525878906,
//       },
//       {
//         end: 35.060001373291016,
//         word: "Eagle",
//         start: 34.81999969482422,
//       },
//       {
//         end: 35.380001068115234,
//         word: "has",
//         start: 35.060001373291016,
//       },
//       {
//         end: 35.599998474121094,
//         word: "landed",
//         start: 35.380001068115234,
//       },
//       {
//         end: 36.099998474121094,
//         word: "he",
//         start: 35.959999084472656,
//       },
//       {
//         end: 36.439998626708984,
//         word: "announced",
//         start: 36.099998474121094,
//       },
//       {
//         end: 37.279998779296875,
//         word: "Then",
//         start: 36.97999954223633,
//       },
//       {
//         end: 37.900001525878906,
//         word: "that",
//         start: 37.7400016784668,
//       },
//       {
//         end: 38.29999923706055,
//         word: "historic",
//         start: 37.900001525878906,
//       },
//       {
//         end: 38.70000076293945,
//         word: "moment",
//         start: 38.29999923706055,
//       },
//       {
//         end: 39.47999954223633,
//         word: "That's",
//         start: 39.2599983215332,
//       },
//       {
//         end: 39.65999984741211,
//         word: "one",
//         start: 39.47999954223633,
//       },
//       {
//         end: 40,
//         word: "small",
//         start: 39.65999984741211,
//       },
//       {
//         end: 40.15999984741211,
//         word: "step",
//         start: 40,
//       },
//       {
//         end: 40.400001525878906,
//         word: "for",
//         start: 40.15999984741211,
//       },
//       {
//         end: 40.68000030517578,
//         word: "man",
//         start: 40.400001525878906,
//       },
//       {
//         end: 41.2400016784668,
//         word: "one",
//         start: 41.02000045776367,
//       },
//       {
//         end: 41.560001373291016,
//         word: "giant",
//         start: 41.2400016784668,
//       },
//       {
//         end: 41.720001220703125,
//         word: "leap",
//         start: 41.560001373291016,
//       },
//       {
//         end: 42.52000045776367,
//         word: "for",
//         start: 41.720001220703125,
//       },
//       {
//         end: 42.52000045776367,
//         word: "mankind",
//         start: 42.52000045776367,
//       },
//       {
//         end: 43.099998474121094,
//         word: "The",
//         start: 42.7599983215332,
//       },
//       {
//         end: 43.36000061035156,
//         word: "world",
//         start: 43.099998474121094,
//       },
//       {
//         end: 43.65999984741211,
//         word: "erupted",
//         start: 43.36000061035156,
//       },
//       {
//         end: 44.380001068115234,
//         word: "in",
//         start: 43.65999984741211,
//       },
//       {
//         end: 44.380001068115234,
//         word: "cheers",
//         start: 44.380001068115234,
//       },
//       {
//         end: 45.119998931884766,
//         word: "tears",
//         start: 45.119998931884766,
//       },
//       {
//         end: 45.91999816894531,
//         word: "America",
//         start: 45.599998474121094,
//       },
//       {
//         end: 46.18000030517578,
//         word: "made",
//         start: 45.91999816894531,
//       },
//       {
//         end: 46.63999938964844,
//         word: "it",
//         start: 46.18000030517578,
//       },
//       {
//         end: 46.81999969482422,
//         word: "But",
//         start: 46.63999938964844,
//       },
//       {
//         end: 53.220001220703125,
//         word: "the",
//         start: 46.81999969482422,
//       },
//       {
//         end: 53.2400016784668,
//         word: "real",
//         start: 53.220001220703125,
//       },
//       {
//         end: 53.58000183105469,
//         word: "All",
//         start: 53.2400016784668,
//       },
//       {
//         end: 53.7599983215332,
//         word: "from",
//         start: 53.58000183105469,
//       },
//       {
//         end: 53.91999816894531,
//         word: "a",
//         start: 53.7599983215332,
//       },
//       {
//         end: 54.18000030517578,
//         word: "moment",
//         start: 53.91999816894531,
//       },
//       {
//         end: 54.47999954223633,
//         word: "born",
//         start: 54.18000030517578,
//       },
//       {
//         end: 54.63999938964844,
//         word: "out",
//         start: 54.47999954223633,
//       },
//       {
//         end: 54.779998779296875,
//         word: "of",
//         start: 54.63999938964844,
//       },
//       {
//         end: 55.220001220703125,
//         word: "competition",
//         start: 54.779998779296875,
//       },
//       {
//         end: 55.540000915527344,
//         word: "and",
//         start: 55.220001220703125,
//       },
//       {
//         end: 55.81999969482422,
//         word: "courage",
//         start: 55.540000915527344,
//       },
//     ],
//     duration: 55.81999969482422,
//   },
//   imagesUrl: [
//     "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_0.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=9aba6e3fd0bb53ed62c5a954cb2ce6dcf9930b1614dcda6677c881746159a864&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
//     "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_1.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=bac9f5b937b1f41137ec218db599f8524cd3cfde51dda3caed31e52a43c6c447&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
//     "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_2.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=47dea4ea7d8ef97372e64e99728838fea57a7e717d2761d43020709d4de59fa2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
//     "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_3.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=261eb2b5af2b79d0f9cb0c6c44e6cfa54e860558842db1bc7c70b694016d8f52&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
//     "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_4.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=b86016b906a582f66ea8df427ce9ec453bd67b2f74443eb6bd8ecf86ceb8988a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
//     "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_5.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=685fa059f1146d1b29bc0582cef972311038952e8acbe6c6c9d0cb7669e6ba8b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
//     "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_6.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=e083bec17533f8eaf342c3c883d616d905eb3481daab4cb03bc781d6e73c5845&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
//   ],
//   audioUrl:
//     "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/audio/voiceover.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=509e4c011c0fd57ff1dc2dc559cac6eccd828e0932829b616b988540ff9c692c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
//   videoUrl:
//     "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/output/shorts/faceless/IBeZWPANnFLz6bBGq4Q6EMeuvA55PhHN/cmn4mis7m000gsgl982yao0tx.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=a44a5a78c13eca66fe20d02e2212c11f9f4cbb6ea279b1197b9a6c4cb9fcba4d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
//   backgroundMusicUrl: null,
//   createdAt: "2026-03-24T13:01:36.466Z",
//   updatedAt: "2026-03-24T18:12:52.936Z",
// };

const videoData = {
  id: "cmox2lsdv000204l1t4vn634i",
  status: "READY",
  videoStyle: "ANIME",
  duration: 64,
  script: {
    id: "cmox2lsdb000004l118nj0yek",
    languageCode: "en",
    topic: "ANY_TOPIC",
    prompt:
      "Ultra cinematic anime YouTube Shorts video, viral pacing, futuristic neon city at night, lone anime hero with glowing eyes, dramatic close-ups, intense aura energy, rain, sparks, lightning, fast action cuts, rooftop running, sword fights, slow motion attacks, emotional stare-downs, explosions, cyberpunk atmosphere, dynamic camera movement, motion blur, volumetric lighting, anime movie quality, smooth animation, beat-synced edits, phonk + orchestral vibe, subtitles, epic transformation sequence, final scene hero floating above destroyed city with massive glowing aura, text overlay: “THEY UNDERESTIMATED HIM.” 9:16 vertical, 4K, ultra detailed, cinematic masterpiece.\n",
    content: [
      "Rain pours down. Hero collapses on the rooftop, breathing hard. Lightning cracks, highlighting bruised knuckles and clenched fists.",
      "Cries echo in the alleys below. He looks up, eyes glowing with determination. Sparks fly as he grips his sword tighter.",
      "Footsteps approach. Fast action cuts show shadows closing in. Close-ups reveal his intense focus. The air crackles with energy.",
      "He charges, rooftop tiles exploding underneath. Sword clashes with enemy steel, each strike sharper, louder.",
      "A slow motion slice through pouring rain. Sparks bursts with every hit. Heart races, beats sync with action.",
      "He falters, drops to one knee. Water splashes around him, eyes meeting the enemy’s. A moment lingers, tension thick.",
      "Aura ignites, burning bright blue. He rises, energy swirling around him, body levitating above devastation.",
      "Final shot: Hero hovers over the city. Massive aura glows. Text overlay: “THEY UNDERESTIMATED HIM.”",
      "Silence, then the city lights flicker back to life. Victory felt in every heartbeat.",
    ],
  },
  voice: {
    id: "cmn7rny7h000141kzh7nbg3pt",
    name: "Donald J. Trump(Noise reduction)",
    gender: "male",
    languageCode: ["en"],
  },
  captionConfig: {
    id: "cmox2lsdj000104l1iivynuhl",
    name: null,
    textColor: "#000000",
    strokeColor: "transparent",
    highlightColor: "#000000",
    highlightStrokeColor: "transparent",
    popBackgroundColor: "transparent",
    strokeWidth: 0,
    fontSize: 90,
    verticalPosition: 85,
    horizontalPosition: 50,
    maxLines: 1,
    maxWordsPerLine: 2,
    shadowOffsetY: 2,
    shadowBlur: 12,
    fontFamily: "Bebas Neue",
    fontWeight: "600",
    textTransform: "lowercase",
    letterSpacing: -5,
    animationPreset: "pop",
    lightLeakHue: 0,
    lightLeakSeed: 2,
    createdAt: "2026-05-08T15:29:05.767Z",
    updatedAt: "2026-05-08T15:29:05.767Z",
  },
  caption: {
    words: [
      {
        end: 0.5400000214576721,
        word: "Rain",
        start: 0,
      },
      {
        end: 0.9800000190734863,
        word: "pours",
        start: 0.5400000214576721,
      },
      {
        end: 1.2799999713897705,
        word: "down",
        start: 0.9800000190734863,
      },
      {
        end: 2,
        word: "Hero",
        start: 2,
      },
      {
        end: 2.4800000190734863,
        word: "collapses",
        start: 2,
      },
      {
        end: 2.799999952316284,
        word: "on",
        start: 2.4800000190734863,
      },
      {
        end: 3.380000114440918,
        word: "the",
        start: 2.799999952316284,
      },
      {
        end: 3.380000114440918,
        word: "rooftop",
        start: 3.380000114440918,
      },
      {
        end: 4.059999942779541,
        word: "breathing",
        start: 4.059999942779541,
      },
      {
        end: 4.539999961853027,
        word: "hard",
        start: 4.059999942779541,
      },
      {
        end: 5.260000228881836,
        word: "Lightning",
        start: 5.099999904632568,
      },
      {
        end: 5.71999979019165,
        word: "cracks",
        start: 5.260000228881836,
      },
      {
        end: 6.380000114440918,
        word: "highlighting",
        start: 6.380000114440918,
      },
      {
        end: 6.860000133514404,
        word: "bruised",
        start: 6.380000114440918,
      },
      {
        end: 7.179999828338623,
        word: "knuckles",
        start: 6.860000133514404,
      },
      {
        end: 7.800000190734863,
        word: "and",
        start: 7.179999828338623,
      },
      {
        end: 7.800000190734863,
        word: "clenched",
        start: 7.800000190734863,
      },
      {
        end: 8.239999771118164,
        word: "fists",
        start: 7.800000190734863,
      },
      {
        end: 9.0600004196167,
        word: "Cries",
        start: 9.0600004196167,
      },
      {
        end: 9.380000114440918,
        word: "echo",
        start: 9.0600004196167,
      },
      {
        end: 9.579999923706055,
        word: "in",
        start: 9.380000114440918,
      },
      {
        end: 9.920000076293945,
        word: "the",
        start: 9.579999923706055,
      },
      {
        end: 9.979999542236328,
        word: "alleys",
        start: 9.920000076293945,
      },
      {
        end: 10.359999656677246,
        word: "below",
        start: 9.979999542236328,
      },
      {
        end: 10.859999656677246,
        word: "He",
        start: 10.779999732971191,
      },
      {
        end: 11.079999923706055,
        word: "looks",
        start: 10.859999656677246,
      },
      {
        end: 11.399999618530273,
        word: "up",
        start: 11.079999923706055,
      },
      {
        end: 11.880000114440918,
        word: "eyes",
        start: 11.680000305175781,
      },
      {
        end: 12.239999771118164,
        word: "glowing",
        start: 11.880000114440918,
      },
      {
        end: 12.579999923706055,
        word: "with",
        start: 12.239999771118164,
      },
      {
        end: 13.15999984741211,
        word: "determination",
        start: 12.579999923706055,
      },
      {
        end: 13.979999542236328,
        word: "Sparks",
        start: 13.979999542236328,
      },
      {
        end: 14.399999618530273,
        word: "fly",
        start: 13.979999542236328,
      },
      {
        end: 14.600000381469727,
        word: "as",
        start: 14.399999618530273,
      },
      {
        end: 15,
        word: "he",
        start: 14.600000381469727,
      },
      {
        end: 15,
        word: "grips",
        start: 15,
      },
      {
        end: 15.5,
        word: "his",
        start: 15,
      },
      {
        end: 15.5,
        word: "sword",
        start: 15.5,
      },
      {
        end: 15.899999618530273,
        word: "tighter",
        start: 15.5,
      },
      {
        end: 16.65999984741211,
        word: "Footsteps",
        start: 16.440000534057617,
      },
      {
        end: 17.219999313354492,
        word: "approach",
        start: 16.65999984741211,
      },
      {
        end: 17.979999542236328,
        word: "Fast",
        start: 17.920000076293945,
      },
      {
        end: 18.399999618530273,
        word: "action",
        start: 17.979999542236328,
      },
      {
        end: 18.700000762939453,
        word: "cuts",
        start: 18.399999618530273,
      },
      {
        end: 19,
        word: "show",
        start: 18.700000762939453,
      },
      {
        end: 19.3799991607666,
        word: "shadows",
        start: 19,
      },
      {
        end: 19.81999969482422,
        word: "closing",
        start: 19.3799991607666,
      },
      {
        end: 20.18000030517578,
        word: "in",
        start: 19.81999969482422,
      },
      {
        end: 20.719999313354492,
        word: "Close",
        start: 20.5,
      },
      {
        end: 20.8799991607666,
        word: "ups",
        start: 20.719999313354492,
      },
      {
        end: 21.260000228881836,
        word: "reveal",
        start: 20.8799991607666,
      },
      {
        end: 21.600000381469727,
        word: "his",
        start: 21.260000228881836,
      },
      {
        end: 21.899999618530273,
        word: "intense",
        start: 21.600000381469727,
      },
      {
        end: 22.31999969482422,
        word: "focus",
        start: 21.899999618530273,
      },
      {
        end: 22.81999969482422,
        word: "The",
        start: 22.639999389648438,
      },
      {
        end: 23.040000915527344,
        word: "air",
        start: 22.81999969482422,
      },
      {
        end: 23.420000076293945,
        word: "crackles",
        start: 23.040000915527344,
      },
      {
        end: 23.700000762939453,
        word: "with",
        start: 23.420000076293945,
      },
      {
        end: 24,
        word: "energy",
        start: 23.700000762939453,
      },
      {
        end: 24.5,
        word: "He",
        start: 24,
      },
      {
        end: 24.959999084472656,
        word: "charges",
        start: 24.5,
      },
      {
        end: 25.81999969482422,
        word: "Rooftop",
        start: 25.579999923706055,
      },
      {
        end: 26.139999389648438,
        word: "tiles",
        start: 25.81999969482422,
      },
      {
        end: 26.760000228881836,
        word: "exploding",
        start: 26.139999389648438,
      },
      {
        end: 27.260000228881836,
        word: "underneath",
        start: 26.760000228881836,
      },
      {
        end: 27.899999618530273,
        word: "Sword",
        start: 27.860000610351562,
      },
      {
        end: 28.280000686645508,
        word: "clashes",
        start: 27.899999618530273,
      },
      {
        end: 28.6200008392334,
        word: "with",
        start: 28.280000686645508,
      },
      {
        end: 28.860000610351562,
        word: "enemy",
        start: 28.6200008392334,
      },
      {
        end: 29.280000686645508,
        word: "steel",
        start: 28.860000610351562,
      },
      {
        end: 29.84000015258789,
        word: "Each",
        start: 29.540000915527344,
      },
      {
        end: 30.1200008392334,
        word: "strike",
        start: 29.84000015258789,
      },
      {
        end: 30.600000381469727,
        word: "sharper",
        start: 30.1200008392334,
      },
      {
        end: 31.260000228881836,
        word: "louder",
        start: 31.239999771118164,
      },
      {
        end: 31.760000228881836,
        word: "A",
        start: 31.540000915527344,
      },
      {
        end: 32,
        word: "slow",
        start: 31.760000228881836,
      },
      {
        end: 32.31999969482422,
        word: "motion",
        start: 32,
      },
      {
        end: 32.720001220703125,
        word: "slice",
        start: 32.31999969482422,
      },
      {
        end: 33.02000045776367,
        word: "through",
        start: 32.720001220703125,
      },
      {
        end: 33.34000015258789,
        word: "pouring",
        start: 33.02000045776367,
      },
      {
        end: 33.70000076293945,
        word: "rain",
        start: 33.34000015258789,
      },
      {
        end: 34.31999969482422,
        word: "Sparks",
        start: 34.31999969482422,
      },
      {
        end: 34.70000076293945,
        word: "burst",
        start: 34.31999969482422,
      },
      {
        end: 34.939998626708984,
        word: "with",
        start: 34.70000076293945,
      },
      {
        end: 35.18000030517578,
        word: "every",
        start: 34.939998626708984,
      },
      {
        end: 35.41999816894531,
        word: "hit",
        start: 35.18000030517578,
      },
      {
        end: 36.13999938964844,
        word: "Heart",
        start: 36.02000045776367,
      },
      {
        end: 36.560001373291016,
        word: "races",
        start: 36.13999938964844,
      },
      {
        end: 37.119998931884766,
        word: "Beat",
        start: 36.880001068115234,
      },
      {
        end: 37.34000015258789,
        word: "sink",
        start: 37.119998931884766,
      },
      {
        end: 37.58000183105469,
        word: "with",
        start: 37.34000015258789,
      },
      {
        end: 37.880001068115234,
        word: "action",
        start: 37.58000183105469,
      },
      {
        end: 38.41999816894531,
        word: "He",
        start: 38.20000076293945,
      },
      {
        end: 38.7599983215332,
        word: "falters",
        start: 38.41999816894531,
      },
      {
        end: 39.439998626708984,
        word: "Drops",
        start: 39.29999923706055,
      },
      {
        end: 39.58000183105469,
        word: "to",
        start: 39.439998626708984,
      },
      {
        end: 39.959999084472656,
        word: "one",
        start: 39.58000183105469,
      },
      {
        end: 40.02000045776367,
        word: "knee",
        start: 39.959999084472656,
      },
      {
        end: 40.68000030517578,
        word: "Water",
        start: 40.5,
      },
      {
        end: 41.119998931884766,
        word: "splashes",
        start: 40.68000030517578,
      },
      {
        end: 41.560001373291016,
        word: "around",
        start: 41.119998931884766,
      },
      {
        end: 41.7599983215332,
        word: "him",
        start: 41.560001373291016,
      },
      {
        end: 42.2400016784668,
        word: "Eyes",
        start: 42.220001220703125,
      },
      {
        end: 42.560001373291016,
        word: "meeting",
        start: 42.2400016784668,
      },
      {
        end: 42.900001525878906,
        word: "the",
        start: 42.560001373291016,
      },
      {
        end: 43.08000183105469,
        word: "enemies",
        start: 42.900001525878906,
      },
      {
        end: 43.81999969482422,
        word: "A",
        start: 43.279998779296875,
      },
      {
        end: 43.81999969482422,
        word: "moment",
        start: 43.81999969482422,
      },
      {
        end: 44.220001220703125,
        word: "lingers",
        start: 43.81999969482422,
      },
      {
        end: 44.81999969482422,
        word: "Tension",
        start: 44.7400016784668,
      },
      {
        end: 45.20000076293945,
        word: "thick",
        start: 44.81999969482422,
      },
      {
        end: 45.70000076293945,
        word: "Aura",
        start: 45.58000183105469,
      },
      {
        end: 46.13999938964844,
        word: "ignites",
        start: 45.70000076293945,
      },
      {
        end: 46.63999938964844,
        word: "burning",
        start: 46.439998626708984,
      },
      {
        end: 46.97999954223633,
        word: "bright",
        start: 46.63999938964844,
      },
      {
        end: 47.279998779296875,
        word: "blue",
        start: 46.97999954223633,
      },
      {
        end: 47.779998779296875,
        word: "He",
        start: 47.540000915527344,
      },
      {
        end: 48.040000915527344,
        word: "rises",
        start: 47.779998779296875,
      },
      {
        end: 48.779998779296875,
        word: "Energy",
        start: 48.65999984741211,
      },
      {
        end: 49.279998779296875,
        word: "swirling",
        start: 48.779998779296875,
      },
      {
        end: 49.58000183105469,
        word: "around",
        start: 49.279998779296875,
      },
      {
        end: 49.779998779296875,
        word: "him",
        start: 49.58000183105469,
      },
      {
        end: 50.279998779296875,
        word: "Body",
        start: 49.779998779296875,
      },
      {
        end: 50.86000061035156,
        word: "levitating",
        start: 50.279998779296875,
      },
      {
        end: 51.220001220703125,
        word: "above",
        start: 50.86000061035156,
      },
      {
        end: 52.08000183105469,
        word: "devastation",
        start: 51.220001220703125,
      },
      {
        end: 52.81999969482422,
        word: "Final",
        start: 52.70000076293945,
      },
      {
        end: 53.18000030517578,
        word: "shot",
        start: 52.81999969482422,
      },
      {
        end: 53.7400016784668,
        word: "Hero",
        start: 53.619998931884766,
      },
      {
        end: 54.08000183105469,
        word: "hovers",
        start: 53.7400016784668,
      },
      {
        end: 54.36000061035156,
        word: "over",
        start: 54.08000183105469,
      },
      {
        end: 54.619998931884766,
        word: "the",
        start: 54.36000061035156,
      },
      {
        end: 54.779998779296875,
        word: "city",
        start: 54.619998931884766,
      },
      {
        end: 55.65999984741211,
        word: "Massive",
        start: 55.36000061035156,
      },
      {
        end: 55.84000015258789,
        word: "aura",
        start: 55.65999984741211,
      },
      {
        end: 56.31999969482422,
        word: "glows",
        start: 55.84000015258789,
      },
      {
        end: 56.959999084472656,
        word: "Text",
        start: 56.70000076293945,
      },
      {
        end: 57.400001525878906,
        word: "overlay",
        start: 56.959999084472656,
      },
      {
        end: 57.959999084472656,
        word: "They",
        start: 57.79999923706055,
      },
      {
        end: 58.68000030517578,
        word: "underestimated",
        start: 57.959999084472656,
      },
      {
        end: 58.91999816894531,
        word: "him",
        start: 58.68000030517578,
      },
      {
        end: 59.619998931884766,
        word: "Silence",
        start: 59.599998474121094,
      },
      {
        end: 60.060001373291016,
        word: "Then",
        start: 59.959999084472656,
      },
      {
        end: 60.29999923706055,
        word: "the",
        start: 60.060001373291016,
      },
      {
        end: 60.47999954223633,
        word: "city",
        start: 60.29999923706055,
      },
      {
        end: 60.7400016784668,
        word: "lights",
        start: 60.47999954223633,
      },
      {
        end: 61.119998931884766,
        word: "flicker",
        start: 60.7400016784668,
      },
      {
        end: 61.31999969482422,
        word: "back",
        start: 61.119998931884766,
      },
      {
        end: 61.63999938964844,
        word: "to",
        start: 61.31999969482422,
      },
      {
        end: 61.7599983215332,
        word: "life",
        start: 61.63999938964844,
      },
      {
        end: 62.36000061035156,
        word: "Victory",
        start: 62.279998779296875,
      },
      {
        end: 62.7400016784668,
        word: "felt",
        start: 62.36000061035156,
      },
      {
        end: 62.91999816894531,
        word: "in",
        start: 62.7400016784668,
      },
      {
        end: 63.18000030517578,
        word: "every",
        start: 62.91999816894531,
      },
      {
        end: 63.47999954223633,
        word: "heartbeat",
        start: 63.18000030517578,
      },
    ],
    duration: 63.47999954223633,
  },
  imagesUrl: [
    "https://shortsvid-production.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/shorts/cmox2lsdv000204l1t4vn634i/images/scene_0.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=14f6da1eee8157a4718c56f075d424da%2F20260508%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260508T185013Z&X-Amz-Expires=3600&X-Amz-Signature=27b488f9af1e4c3279d988e22443b6f2817738958a55c504c0144c8a08fdd943&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-production.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/shorts/cmox2lsdv000204l1t4vn634i/images/scene_1.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=14f6da1eee8157a4718c56f075d424da%2F20260508%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260508T185013Z&X-Amz-Expires=3600&X-Amz-Signature=4d652d961dba4d350153748125faad9573cf5172447de2961ef71b2b0c44981b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-production.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/shorts/cmox2lsdv000204l1t4vn634i/images/scene_2.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=14f6da1eee8157a4718c56f075d424da%2F20260508%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260508T185013Z&X-Amz-Expires=3600&X-Amz-Signature=5bec2a1c50669e393bcc10c059528984eef33397ad6f5c3fde13b2cf9f5d78ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-production.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/shorts/cmox2lsdv000204l1t4vn634i/images/scene_3.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=14f6da1eee8157a4718c56f075d424da%2F20260508%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260508T185013Z&X-Amz-Expires=3600&X-Amz-Signature=99ac922836589759867d36e9a0f12ea29d6cd17f13f8aecbe0c81531b3ef2e79&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-production.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/shorts/cmox2lsdv000204l1t4vn634i/images/scene_4.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=14f6da1eee8157a4718c56f075d424da%2F20260508%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260508T185013Z&X-Amz-Expires=3600&X-Amz-Signature=08665c233903ac0b459b148bb95797c117af8d0bee24fdfe7a03b5c83a0e06ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-production.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/shorts/cmox2lsdv000204l1t4vn634i/images/scene_5.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=14f6da1eee8157a4718c56f075d424da%2F20260508%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260508T185013Z&X-Amz-Expires=3600&X-Amz-Signature=033f8818ec68518e7843066a6b58a62cca0eab0d062553089221c73453f5b6aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-production.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/shorts/cmox2lsdv000204l1t4vn634i/images/scene_6.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=14f6da1eee8157a4718c56f075d424da%2F20260508%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260508T185013Z&X-Amz-Expires=3600&X-Amz-Signature=72838121fd4b6b18fb289ab571f3f69976218f20117ef087a133205bcb08ed08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-production.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/shorts/cmox2lsdv000204l1t4vn634i/images/scene_7.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=14f6da1eee8157a4718c56f075d424da%2F20260508%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260508T185013Z&X-Amz-Expires=3600&X-Amz-Signature=e0ada33e1df84c040029ce250ee7ae59eac4fc662b951e865977aa3e6ac465d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  ],
  audioUrl:
    "https://shortsvid-production.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/shorts/cmox2lsdv000204l1t4vn634i/audio/voiceover.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=14f6da1eee8157a4718c56f075d424da%2F20260508%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260508T185013Z&X-Amz-Expires=3600&X-Amz-Signature=820f9a7b4422f4dc4bc21b52b3041583b82b648940dc98423cc4e3789415ab4b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  videoUrl: null,
  backgroundMusicUrl:
    "https://shortsvid-production.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/stock/music/system/cmn7rpssv001f41kzs5rqzqfd?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=14f6da1eee8157a4718c56f075d424da%2F20260508%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260508T185013Z&X-Amz-Expires=3600&X-Amz-Signature=e9cafe2abed54f48959e836c3bd01dc47d9a7265d074b47a197ba8890ca41911&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  createdAt: "2026-05-08T15:29:05.779Z",
  updatedAt: "2026-05-08T15:31:34.493Z",
};

// ─── calculateMetadata: Faceless ─────────────────────────────────────────────
// Duration comes from the caption data's last word end-time (most accurate)
// or falls back to the video.duration stored in DB.

const calculateFacelessMetadata: CalculateMetadataFunction<
  FacelessRootProps
> = ({ props }) => {
  const caption = props.videoData?.caption as {
    words?: { end: number }[];
    duration?: number;
  } | null;
  const captionDuration =
    caption?.duration ??
    (caption?.words?.length
      ? caption.words[caption.words.length - 1].end
      : null);
  const duration = captionDuration ?? props.videoData?.duration ?? 60;
  return {
    durationInFrames: Math.ceil(duration * 30),
  };
};

// ─── calculateMetadata: Conversation ─────────────────────────────────────────
// Same strategy: use last word's end-time from the flat caption words array.

const calculateConversationMetadata: CalculateMetadataFunction<
  ConversationRootProps
> = ({ props }) => {
  const caption = props.videoData?.caption as {
    words?: { end: number }[];
    duration?: number;
  } | null;
  const captionDuration =
    caption?.duration ??
    (caption?.words?.length
      ? caption.words[caption.words.length - 1].end
      : null);
  const duration = captionDuration ?? props.videoData?.duration ?? 60;
  return {
    durationInFrames: Math.ceil(duration * 30),
  };
};

// ─── Dev defaultProps: Conversation video ─────────────────────────────────────
// These are used only in Remotion Studio preview. Replace URLs with fresh
// signed URLs when testing; they expire after 1 hour.

const conversationVideoData: ConversationVideo = {
  id: "cmo2ywxby000204l9d5gioggz",
  duration: 64,
  script: {
    content: [
      "Hey, uh, SpongeBob, I've been hearin' all this buzz about 'React.' What is it, some new dance move I should know about?",
      "Oh, Peter, it's not a dance! React is this amazing JavaScript library! It helps you build cool, interactive user interfaces. Perfect for organizing your thoughts, almost like putting jellyfish in a perfect line.",
      "Ah, gotcha! So, it's like, I can use it to make those menus at the Drunken Clam dance across the screen or something?",
      "Exactly! You can make your menus appear, disappear, and even do backflips if you want! It’s all about rendering efficiently and keeping things fresh.",
      "Wow, I've been rendering efficiently by just finding the remote faster, but this sounds more impressive. Does it help with, uh, say, keeping track of TV shows I've binged?",
      "Totally! You could create a nifty tracker. Each time you watch, React can update your list instantly without reloading the whole page. It's magic, really.",
      "Geez, with all these options, I might become a tech wizard in my own right. Can I build a virtual Quahog with it?",
      "Haha, you sure can! Add a few more tools with React, and you've got yourself a bustling digital metropolis. The possibilities are as endless as a Krabby Patty's flavor combinations!",
    ],
  },
  captionConfig: {
    textColor: "#FFFFFF",
    strokeColor: "#000000",
    highlightColor: "#FFFFFF",
    highlightStrokeColor: "transparent",
    popBackgroundColor: "#6C3CF7",
    strokeWidth: 0.5,
    fontSize: 85,
    verticalPosition: 53,
    horizontalPosition: 50,
    maxLines: 2,
    maxWordsPerLine: 2,
    shadowOffsetY: 0,
    shadowBlur: 0,
    fontFamily: "Montserrat",
    fontWeight: "800",
    textTransform: "none",
    letterSpacing: 0,
    animationPreset: "pop",
    lightLeakHue: 240,
    lightLeakSeed: 3,
  },
  caption: {
    words: [
      {
        end: 0.4000000059604645,
        word: "Hey",
        start: 0,
      },
      {
        end: 0.9599999785423279,
        word: "uh",
        start: 0.47999998927116394,
      },
      {
        end: 1.2400000095367432,
        word: "Spongebob",
        start: 0.9599999785423279,
      },
      {
        end: 1.5199999809265137,
        word: "I've",
        start: 1.2999999523162842,
      },
      {
        end: 1.600000023841858,
        word: "been",
        start: 1.5199999809265137,
      },
      {
        end: 1.8200000524520874,
        word: "hearing",
        start: 1.600000023841858,
      },
      {
        end: 2.0399999618530273,
        word: "all",
        start: 1.8200000524520874,
      },
      {
        end: 2.180000066757202,
        word: "this",
        start: 2.0399999618530273,
      },
      {
        end: 2.380000114440918,
        word: "buzz",
        start: 2.180000066757202,
      },
      {
        end: 2.700000047683716,
        word: "about",
        start: 2.380000114440918,
      },
      {
        end: 3.0399999618530273,
        word: "React",
        start: 2.700000047683716,
      },
      {
        end: 3.440000057220459,
        word: "What",
        start: 3.2200000286102295,
      },
      {
        end: 3.5399999618530273,
        word: "is",
        start: 3.440000057220459,
      },
      {
        end: 3.700000047683716,
        word: "it",
        start: 3.5399999618530273,
      },
      {
        end: 3.859999895095825,
        word: "some",
        start: 3.700000047683716,
      },
      {
        end: 4.099999904632568,
        word: "new",
        start: 3.859999895095825,
      },
      {
        end: 4.320000171661377,
        word: "dance",
        start: 4.099999904632568,
      },
      {
        end: 4.559999942779541,
        word: "move",
        start: 4.320000171661377,
      },
      {
        end: 4.71999979019165,
        word: "I",
        start: 4.559999942779541,
      },
      {
        end: 4.880000114440918,
        word: "should",
        start: 4.71999979019165,
      },
      {
        end: 5.019999980926514,
        word: "know",
        start: 4.880000114440918,
      },
      {
        end: 5.260000228881836,
        word: "about",
        start: 5.019999980926514,
      },
      {
        end: 5.880000114440918,
        word: "Oh",
        start: 5.440000057220459,
      },
      {
        end: 6.159999847412109,
        word: "Peter",
        start: 5.880000114440918,
      },
      {
        end: 6.420000076293945,
        word: "it's",
        start: 6.199999809265137,
      },
      {
        end: 6.679999828338623,
        word: "not",
        start: 6.420000076293945,
      },
      {
        end: 7.260000228881836,
        word: "a",
        start: 6.679999828338623,
      },
      {
        end: 7.260000228881836,
        word: "dance",
        start: 7.260000228881836,
      },
      {
        end: 7.679999828338623,
        word: "React",
        start: 7.639999866485596,
      },
      {
        end: 8.039999961853027,
        word: "is",
        start: 7.679999828338623,
      },
      {
        end: 8.239999771118164,
        word: "this",
        start: 8.039999961853027,
      },
      {
        end: 8.65999984741211,
        word: "amazing",
        start: 8.239999771118164,
      },
      {
        end: 9.180000305175781,
        word: "JavaScript",
        start: 8.65999984741211,
      },
      {
        end: 9.859999656677246,
        word: "library",
        start: 9.180000305175781,
      },
      {
        end: 10.260000228881836,
        word: "It",
        start: 10.0600004196167,
      },
      {
        end: 10.420000076293945,
        word: "helps",
        start: 10.260000228881836,
      },
      {
        end: 10.699999809265137,
        word: "you",
        start: 10.420000076293945,
      },
      {
        end: 10.779999732971191,
        word: "build",
        start: 10.699999809265137,
      },
      {
        end: 11.239999771118164,
        word: "cool",
        start: 10.779999732971191,
      },
      {
        end: 11.720000267028809,
        word: "interactive",
        start: 11.720000267028809,
      },
      {
        end: 12.140000343322754,
        word: "user",
        start: 11.720000267028809,
      },
      {
        end: 12.619999885559082,
        word: "interfaces",
        start: 12.140000343322754,
      },
      {
        end: 13.180000305175781,
        word: "perfect",
        start: 13.0600004196167,
      },
      {
        end: 13.800000190734863,
        word: "for",
        start: 13.180000305175781,
      },
      {
        end: 13.800000190734863,
        word: "organizing",
        start: 13.800000190734863,
      },
      {
        end: 14.399999618530273,
        word: "your",
        start: 13.800000190734863,
      },
      {
        end: 14.399999618530273,
        word: "thoughts",
        start: 14.399999618530273,
      },
      {
        end: 14.84000015258789,
        word: "almost",
        start: 14.640000343322754,
      },
      {
        end: 15.239999771118164,
        word: "like",
        start: 14.84000015258789,
      },
      {
        end: 15.300000190734863,
        word: "putting",
        start: 15.239999771118164,
      },
      {
        end: 15.779999732971191,
        word: "jellyfish",
        start: 15.300000190734863,
      },
      {
        end: 15.9399995803833,
        word: "in",
        start: 15.779999732971191,
      },
      {
        end: 16.100000381469727,
        word: "a",
        start: 15.9399995803833,
      },
      {
        end: 16.360000610351562,
        word: "perfect",
        start: 16.100000381469727,
      },
      {
        end: 16.799999237060547,
        word: "line",
        start: 16.360000610351562,
      },
      {
        end: 17.600000381469727,
        word: "Ah",
        start: 17.15999984741211,
      },
      {
        end: 18.040000915527344,
        word: "gotcha",
        start: 17.600000381469727,
      },
      {
        end: 18.3799991607666,
        word: "So",
        start: 18.040000915527344,
      },
      {
        end: 18.700000762939453,
        word: "it's",
        start: 18.3799991607666,
      },
      {
        end: 18.979999542236328,
        word: "like",
        start: 18.700000762939453,
      },
      {
        end: 19.239999771118164,
        word: "I",
        start: 19,
      },
      {
        end: 19.420000076293945,
        word: "can",
        start: 19.239999771118164,
      },
      {
        end: 19.579999923706055,
        word: "use",
        start: 19.420000076293945,
      },
      {
        end: 19.68000030517578,
        word: "it",
        start: 19.579999923706055,
      },
      {
        end: 19.799999237060547,
        word: "to",
        start: 19.68000030517578,
      },
      {
        end: 19.920000076293945,
        word: "make",
        start: 19.799999237060547,
      },
      {
        end: 20.280000686645508,
        word: "those",
        start: 19.920000076293945,
      },
      {
        end: 20.420000076293945,
        word: "menus",
        start: 20.280000686645508,
      },
      {
        end: 20.6200008392334,
        word: "at",
        start: 20.420000076293945,
      },
      {
        end: 20.799999237060547,
        word: "the",
        start: 20.6200008392334,
      },
      {
        end: 21.040000915527344,
        word: "drunken",
        start: 20.799999237060547,
      },
      {
        end: 21.399999618530273,
        word: "clam",
        start: 21.040000915527344,
      },
      {
        end: 21.68000030517578,
        word: "dance",
        start: 21.399999618530273,
      },
      {
        end: 21.959999084472656,
        word: "across",
        start: 21.68000030517578,
      },
      {
        end: 22.200000762939453,
        word: "the",
        start: 21.959999084472656,
      },
      {
        end: 22.299999237060547,
        word: "screen",
        start: 22.200000762939453,
      },
      {
        end: 22.520000457763672,
        word: "or",
        start: 22.299999237060547,
      },
      {
        end: 22.639999389648438,
        word: "something",
        start: 22.520000457763672,
      },
      {
        end: 23.420000076293945,
        word: "Exactly",
        start: 22.979999542236328,
      },
      {
        end: 23.84000015258789,
        word: "You",
        start: 23.579999923706055,
      },
      {
        end: 24,
        word: "can",
        start: 23.84000015258789,
      },
      {
        end: 24.15999984741211,
        word: "make",
        start: 24,
      },
      {
        end: 24.559999465942383,
        word: "your",
        start: 24.15999984741211,
      },
      {
        end: 24.559999465942383,
        word: "menus",
        start: 24.559999465942383,
      },
      {
        end: 24.959999084472656,
        word: "appear",
        start: 24.559999465942383,
      },
      {
        end: 25.559999465942383,
        word: "disappear",
        start: 25.559999465942383,
      },
      {
        end: 25.760000228881836,
        word: "and",
        start: 25.559999465942383,
      },
      {
        end: 25.920000076293945,
        word: "even",
        start: 25.760000228881836,
      },
      {
        end: 26.139999389648438,
        word: "do",
        start: 25.920000076293945,
      },
      {
        end: 26.540000915527344,
        word: "backflips",
        start: 26.139999389648438,
      },
      {
        end: 26.739999771118164,
        word: "if",
        start: 26.540000915527344,
      },
      {
        end: 26.899999618530273,
        word: "you",
        start: 26.739999771118164,
      },
      {
        end: 27.200000762939453,
        word: "want",
        start: 26.899999618530273,
      },
      {
        end: 27.639999389648438,
        word: "It's",
        start: 27.200000762939453,
      },
      {
        end: 27.84000015258789,
        word: "all",
        start: 27.639999389648438,
      },
      {
        end: 28.079999923706055,
        word: "about",
        start: 27.84000015258789,
      },
      {
        end: 28.399999618530273,
        word: "rendering",
        start: 28.079999923706055,
      },
      {
        end: 28.940000534057617,
        word: "efficiently",
        start: 28.399999618530273,
      },
      {
        end: 29.18000030517578,
        word: "and",
        start: 28.940000534057617,
      },
      {
        end: 29.440000534057617,
        word: "keeping",
        start: 29.18000030517578,
      },
      {
        end: 29.739999771118164,
        word: "things",
        start: 29.440000534057617,
      },
      {
        end: 30.219999313354492,
        word: "fresh",
        start: 29.739999771118164,
      },
      {
        end: 30.899999618530273,
        word: "Wow",
        start: 30.8799991607666,
      },
      {
        end: 31.5,
        word: "I've",
        start: 31.260000228881836,
      },
      {
        end: 31.6200008392334,
        word: "been",
        start: 31.5,
      },
      {
        end: 31.979999542236328,
        word: "rendering",
        start: 31.6200008392334,
      },
      {
        end: 32.47999954223633,
        word: "efficiently",
        start: 31.979999542236328,
      },
      {
        end: 32.70000076293945,
        word: "by",
        start: 32.47999954223633,
      },
      {
        end: 33.060001373291016,
        word: "just",
        start: 32.70000076293945,
      },
      {
        end: 33.18000030517578,
        word: "finding",
        start: 33.060001373291016,
      },
      {
        end: 33.380001068115234,
        word: "the",
        start: 33.18000030517578,
      },
      {
        end: 33.58000183105469,
        word: "remote",
        start: 33.380001068115234,
      },
      {
        end: 34.099998474121094,
        word: "faster",
        start: 33.58000183105469,
      },
      {
        end: 34.29999923706055,
        word: "but",
        start: 34.2400016784668,
      },
      {
        end: 34.52000045776367,
        word: "this",
        start: 34.29999923706055,
      },
      {
        end: 34.70000076293945,
        word: "sounds",
        start: 34.52000045776367,
      },
      {
        end: 35,
        word: "more",
        start: 34.70000076293945,
      },
      {
        end: 35.279998779296875,
        word: "impressive",
        start: 35,
      },
      {
        end: 35.58000183105469,
        word: "Does",
        start: 35.560001373291016,
      },
      {
        end: 35.779998779296875,
        word: "it",
        start: 35.58000183105469,
      },
      {
        end: 35.900001525878906,
        word: "help",
        start: 35.779998779296875,
      },
      {
        end: 36.119998931884766,
        word: "with",
        start: 35.900001525878906,
      },
      {
        end: 36.41999816894531,
        word: "uh",
        start: 36.119998931884766,
      },
      {
        end: 36.70000076293945,
        word: "say",
        start: 36.41999816894531,
      },
      {
        end: 36.779998779296875,
        word: "keeping",
        start: 36.70000076293945,
      },
      {
        end: 37.099998474121094,
        word: "track",
        start: 36.779998779296875,
      },
      {
        end: 37.29999923706055,
        word: "of",
        start: 37.099998474121094,
      },
      {
        end: 37.619998931884766,
        word: "TV",
        start: 37.29999923706055,
      },
      {
        end: 37.84000015258789,
        word: "shows",
        start: 37.619998931884766,
      },
      {
        end: 38.34000015258789,
        word: "I've",
        start: 37.84000015258789,
      },
      {
        end: 38.58000183105469,
        word: "binged",
        start: 38.34000015258789,
      },
      {
        end: 39.2599983215332,
        word: "Totally",
        start: 38.779998779296875,
      },
      {
        end: 39.779998779296875,
        word: "You",
        start: 39.65999984741211,
      },
      {
        end: 40,
        word: "could",
        start: 39.779998779296875,
      },
      {
        end: 40.2599983215332,
        word: "create",
        start: 40,
      },
      {
        end: 40.7400016784668,
        word: "a",
        start: 40.2599983215332,
      },
      {
        end: 40.7400016784668,
        word: "nifty",
        start: 40.7400016784668,
      },
      {
        end: 41.2599983215332,
        word: "tracker",
        start: 40.7400016784668,
      },
      {
        end: 41.779998779296875,
        word: "Each",
        start: 41.68000030517578,
      },
      {
        end: 42,
        word: "time",
        start: 41.779998779296875,
      },
      {
        end: 42.18000030517578,
        word: "you",
        start: 42,
      },
      {
        end: 42.47999954223633,
        word: "watch",
        start: 42.18000030517578,
      },
      {
        end: 42.68000030517578,
        word: "React",
        start: 42.63999938964844,
      },
      {
        end: 42.97999954223633,
        word: "can",
        start: 42.68000030517578,
      },
      {
        end: 43.220001220703125,
        word: "update",
        start: 42.97999954223633,
      },
      {
        end: 43.68000030517578,
        word: "your",
        start: 43.220001220703125,
      },
      {
        end: 43.68000030517578,
        word: "list",
        start: 43.68000030517578,
      },
      {
        end: 44.119998931884766,
        word: "instantly",
        start: 43.68000030517578,
      },
      {
        end: 44.47999954223633,
        word: "without",
        start: 44.119998931884766,
      },
      {
        end: 44.91999816894531,
        word: "reloading",
        start: 44.47999954223633,
      },
      {
        end: 45.040000915527344,
        word: "the",
        start: 44.91999816894531,
      },
      {
        end: 45.279998779296875,
        word: "whole",
        start: 45.040000915527344,
      },
      {
        end: 45.560001373291016,
        word: "page",
        start: 45.279998779296875,
      },
      {
        end: 46.08000183105469,
        word: "It's",
        start: 45.779998779296875,
      },
      {
        end: 46.459999084472656,
        word: "magic",
        start: 46.08000183105469,
      },
      {
        end: 46.91999816894531,
        word: "really",
        start: 46.540000915527344,
      },
      {
        end: 47.68000030517578,
        word: "Geez",
        start: 47.2400016784668,
      },
      {
        end: 47.900001525878906,
        word: "with",
        start: 47.70000076293945,
      },
      {
        end: 48.20000076293945,
        word: "all",
        start: 47.900001525878906,
      },
      {
        end: 48.41999816894531,
        word: "these",
        start: 48.20000076293945,
      },
      {
        end: 48.779998779296875,
        word: "options",
        start: 48.41999816894531,
      },
      {
        end: 49.060001373291016,
        word: "I",
        start: 48.81999969482422,
      },
      {
        end: 49.220001220703125,
        word: "might",
        start: 49.060001373291016,
      },
      {
        end: 49.41999816894531,
        word: "become",
        start: 49.220001220703125,
      },
      {
        end: 49.7599983215332,
        word: "a",
        start: 49.41999816894531,
      },
      {
        end: 49.84000015258789,
        word: "tech",
        start: 49.7599983215332,
      },
      {
        end: 50.02000045776367,
        word: "wizard",
        start: 49.84000015258789,
      },
      {
        end: 50.20000076293945,
        word: "in",
        start: 50.02000045776367,
      },
      {
        end: 50.36000061035156,
        word: "my",
        start: 50.20000076293945,
      },
      {
        end: 50.540000915527344,
        word: "own",
        start: 50.36000061035156,
      },
      {
        end: 50.84000015258789,
        word: "right",
        start: 50.540000915527344,
      },
      {
        end: 51.20000076293945,
        word: "Can",
        start: 51.08000183105469,
      },
      {
        end: 51.47999954223633,
        word: "I",
        start: 51.20000076293945,
      },
      {
        end: 51.52000045776367,
        word: "build",
        start: 51.47999954223633,
      },
      {
        end: 52.08000183105469,
        word: "a",
        start: 51.52000045776367,
      },
      {
        end: 52.08000183105469,
        word: "virtual",
        start: 52.08000183105469,
      },
      {
        end: 52.52000045776367,
        word: "Quahog",
        start: 52.08000183105469,
      },
      {
        end: 52.7599983215332,
        word: "with",
        start: 52.52000045776367,
      },
      {
        end: 52.900001525878906,
        word: "it",
        start: 52.7599983215332,
      },
      {
        end: 53.68000030517578,
        word: "Ha",
        start: 53.20000076293945,
      },
      {
        end: 53.68000030517578,
        word: "ha",
        start: 53.68000030517578,
      },
      {
        end: 54.02000045776367,
        word: "you",
        start: 53.68000030517578,
      },
      {
        end: 54.279998779296875,
        word: "sure",
        start: 54.02000045776367,
      },
      {
        end: 54.79999923706055,
        word: "can",
        start: 54.279998779296875,
      },
      {
        end: 55.29999923706055,
        word: "Add",
        start: 55.02000045776367,
      },
      {
        end: 55.52000045776367,
        word: "a",
        start: 55.29999923706055,
      },
      {
        end: 55.560001373291016,
        word: "few",
        start: 55.52000045776367,
      },
      {
        end: 55.900001525878906,
        word: "more",
        start: 55.560001373291016,
      },
      {
        end: 55.97999954223633,
        word: "tools",
        start: 55.900001525878906,
      },
      {
        end: 56.279998779296875,
        word: "with",
        start: 55.97999954223633,
      },
      {
        end: 56.58000183105469,
        word: "React",
        start: 56.279998779296875,
      },
      {
        end: 56.79999923706055,
        word: "and",
        start: 56.58000183105469,
      },
      {
        end: 57.15999984741211,
        word: "you've",
        start: 56.79999923706055,
      },
      {
        end: 57.29999923706055,
        word: "got",
        start: 57.15999984741211,
      },
      {
        end: 57.68000030517578,
        word: "yourself",
        start: 57.29999923706055,
      },
      {
        end: 57.91999816894531,
        word: "a",
        start: 57.68000030517578,
      },
      {
        end: 58.36000061035156,
        word: "bustling",
        start: 57.91999816894531,
      },
      {
        end: 58.68000030517578,
        word: "digital",
        start: 58.36000061035156,
      },
      {
        end: 59.279998779296875,
        word: "metropolis",
        start: 58.68000030517578,
      },
      {
        end: 59.720001220703125,
        word: "The",
        start: 59.65999984741211,
      },
      {
        end: 60.31999969482422,
        word: "possibilities",
        start: 59.720001220703125,
      },
      {
        end: 60.58000183105469,
        word: "are",
        start: 60.31999969482422,
      },
      {
        end: 60.79999923706055,
        word: "as",
        start: 60.58000183105469,
      },
      {
        end: 61.119998931884766,
        word: "endless",
        start: 60.79999923706055,
      },
      {
        end: 61.29999923706055,
        word: "as",
        start: 61.119998931884766,
      },
      {
        end: 61.47999954223633,
        word: "a",
        start: 61.29999923706055,
      },
      {
        end: 61.81999969482422,
        word: "Krabby",
        start: 61.47999954223633,
      },
      {
        end: 62.279998779296875,
        word: "Patty's",
        start: 61.81999969482422,
      },
      {
        end: 62.560001373291016,
        word: "flavor",
        start: 62.279998779296875,
      },
      {
        end: 63.099998474121094,
        word: "combinations",
        start: 62.560001373291016,
      },
    ],
    duration: 63.099998474121094,
  },
  speaker1AvatarUrl:
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/stock/avatar/system/cmo00at0p000iaol9i2vrztfo?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=efb97de48b7849b936f38e8a5a31241a%2F20260417%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260417T184624Z&X-Amz-Expires=3600&X-Amz-Signature=340ef0eddd5f923950f72edf2fd6a3b33dfe5663034fd358335d16ab10b1c2e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  speaker2AvatarUrl:
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/stock/avatar/system/cmo00au65000jaol9vv6f8ckz?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=efb97de48b7849b936f38e8a5a31241a%2F20260417%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260417T184624Z&X-Amz-Expires=3600&X-Amz-Signature=4cfc9c5f19833497943b71e4d0fe16e4d9ab97847eeb38eede54a0d64d1ff2cd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  audioUrl:
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/shorts/cmo2ywxby000204l9d5gioggz/audio/voiceover.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=efb97de48b7849b936f38e8a5a31241a%2F20260417%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260417T184624Z&X-Amz-Expires=3600&X-Amz-Signature=64301e45ad34ef9f639e0d57bcb8810b03c500832769c67f491c55b80a06e445&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  backgroundVideoUrl:
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/stock/video/system/cmnz9ds7b0009eol9r5j3v062?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=efb97de48b7849b936f38e8a5a31241a%2F20260417%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260417T184624Z&X-Amz-Expires=3600&X-Amz-Signature=b7bc6ceca73831dad48db45883542ba83233774021b63e72e7441b9c685a118b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  backgroundMusicUrl: null,
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Faceless AI-image shorts ── */}
      <Composition
        id="renderVideo"
        component={RemotionComposition}
        durationInFrames={1800} // placeholder — overridden by calculateMetadata
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          // @ts-ignore
          videoData: videoData,
        }}
        calculateMetadata={calculateFacelessMetadata}
      />

      {/* ── Dual-speaker conversation videos ── */}
      <Composition
        id="renderConversationVideo"
        component={ConversationVideoComposition}
        durationInFrames={1800} // placeholder — overridden by calculateMetadata
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoData: conversationVideoData,
        }}
        calculateMetadata={calculateConversationMetadata}
      />
    </>
  );
};
