import React from "react";
import RemotionComposition from "../components/remotion/remotion-composition";
import { Composition, CalculateMetadataFunction } from "remotion";
import { ShortsVideo } from "../types";

type RootProps = {
  videoData: ShortsVideo;
};

const videoData = {
  id: "cmn4mis7m000gsgl982yao0tx",
  status: "SUCCESS",
  videoStyle: "CINEMATIC",
  duration: 56,
  script: {
    id: "cmn4mirur000esgl9c5kxva32",
    languageCode: "en",
    topic: "HISTORY_FACTS",
    prompt: "how america reached moon",
    content: [
      "In 1961, the United States set an insane goal: landing humans on the moon by the end of the decade. It sounded impossible.",
      "The Cold War was intense. The space race? Even more. John F. Kennedy's voice echoed: 'We choose to go to the moon not because it is easy, but because it is hard.'",
      "Scientists at NASA scrambled. Computers as big as rooms. Calculations by hand. Every misstep meant death in space.",
      'In 1969, tension peaked. Broadcast live, millions held their breath. Neil Armstrong\'s heartbeat was racing as he descended the ladder. "The Eagle has landed," he announced.',
      "Then, that historic moment: 'That's one small step for man, one giant leap for mankind.' The world erupted in cheers, tears.",
      "America made it. But the real impact? A leap in technology, shifting how we live today. From tiny computers to GPS, all from a moment born out of competition and courage.",
    ],
  },
  voice: {
    id: "cmmib8d0q0004dcl9eri5v2tl",
    name: "Ethan",
    gender: "male",
    languageCode: ["en"],
  },
  captionConfig: {
    id: "cmn4mis10000fsgl9ny8s8kpw",
    name: null,
    textColor: "#FFFFFF",
    strokeColor: "#000000",
    highlightColor: "#FFFFFF",
    highlightStrokeColor: "transparent",
    popBackgroundColor: "#6C3CF7",
    strokeWidth: 0.2,
    fontSize: 85,
    verticalPosition: 80,
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
    createdAt: "2026-03-24T13:01:36.228Z",
    updatedAt: "2026-03-24T13:01:36.228Z",
  },
  caption: {
    words: [
      {
        end: 0.3199999928474426,
        word: "In",
        start: 0,
      },
      {
        end: 1.2999999523162842,
        word: "1961",
        start: 0.3199999928474426,
      },
      {
        end: 1.840000033378601,
        word: "the",
        start: 1.7599999904632568,
      },
      {
        end: 2.240000009536743,
        word: "United",
        start: 1.840000033378601,
      },
      {
        end: 2.440000057220459,
        word: "States",
        start: 2.240000009536743,
      },
      {
        end: 2.680000066757202,
        word: "set",
        start: 2.440000057220459,
      },
      {
        end: 2.9000000953674316,
        word: "an",
        start: 2.680000066757202,
      },
      {
        end: 3.2200000286102295,
        word: "insane",
        start: 2.9000000953674316,
      },
      {
        end: 3.5799999237060547,
        word: "goal",
        start: 3.2200000286102295,
      },
      {
        end: 4.28000020980835,
        word: "landing",
        start: 4.28000020980835,
      },
      {
        end: 4.619999885559082,
        word: "humans",
        start: 4.28000020980835,
      },
      {
        end: 4.800000190734863,
        word: "on",
        start: 4.619999885559082,
      },
      {
        end: 5.079999923706055,
        word: "the",
        start: 4.800000190734863,
      },
      {
        end: 5.079999923706055,
        word: "moon",
        start: 5.079999923706055,
      },
      {
        end: 5.260000228881836,
        word: "by",
        start: 5.079999923706055,
      },
      {
        end: 5.559999942779541,
        word: "the",
        start: 5.260000228881836,
      },
      {
        end: 5.599999904632568,
        word: "end",
        start: 5.559999942779541,
      },
      {
        end: 5.71999979019165,
        word: "of",
        start: 5.599999904632568,
      },
      {
        end: 5.920000076293945,
        word: "the",
        start: 5.71999979019165,
      },
      {
        end: 6.199999809265137,
        word: "decade",
        start: 5.679999828338623,
      },
      {
        end: 7.019999980926514,
        word: "It",
        start: 6.800000190734863,
      },
      {
        end: 7.239999771118164,
        word: "sounded",
        start: 7.019999980926514,
      },
      {
        end: 7.860000133514404,
        word: "impossible",
        start: 7.239999771118164,
      },
      {
        end: 8.600000381469727,
        word: "The",
        start: 8.479999542236328,
      },
      {
        end: 8.960000038146973,
        word: "Cold",
        start: 8.600000381469727,
      },
      {
        end: 9.020000457763672,
        word: "War",
        start: 8.960000038146973,
      },
      {
        end: 9.279999732971191,
        word: "was",
        start: 9.020000457763672,
      },
      {
        end: 9.680000305175781,
        word: "intense",
        start: 9.279999732971191,
      },
      {
        end: 10.359999656677246,
        word: "The",
        start: 10.199999809265137,
      },
      {
        end: 10.680000305175781,
        word: "space",
        start: 10.359999656677246,
      },
      {
        end: 10.960000038146973,
        word: "race",
        start: 10.680000305175781,
      },
      {
        end: 11.680000305175781,
        word: "Even",
        start: 11.479999542236328,
      },
      {
        end: 12,
        word: "more",
        start: 11.680000305175781,
      },
      {
        end: 12.84000015258789,
        word: "John",
        start: 12.5600004196167,
      },
      {
        end: 13.100000381469727,
        word: "F",
        start: 12.84000015258789,
      },
      {
        end: 13.4399995803833,
        word: "Kennedy's",
        start: 13.220000267028809,
      },
      {
        end: 13.619999885559082,
        word: "voice",
        start: 13.4399995803833,
      },
      {
        end: 14.199999809265137,
        word: "echoed",
        start: 13.619999885559082,
      },
      {
        end: 14.539999961853027,
        word: "We",
        start: 14.399999618530273,
      },
      {
        end: 14.84000015258789,
        word: "choose",
        start: 14.539999961853027,
      },
      {
        end: 15.020000457763672,
        word: "to",
        start: 14.84000015258789,
      },
      {
        end: 15.119999885559082,
        word: "go",
        start: 15.020000457763672,
      },
      {
        end: 15.220000267028809,
        word: "to",
        start: 15.119999885559082,
      },
      {
        end: 15.5600004196167,
        word: "the",
        start: 15.220000267028809,
      },
      {
        end: 15.5600004196167,
        word: "moon",
        start: 15.5600004196167,
      },
      {
        end: 15.819999694824219,
        word: "not",
        start: 15.5600004196167,
      },
      {
        end: 16.059999465942383,
        word: "because",
        start: 15.819999694824219,
      },
      {
        end: 16.18000030517578,
        word: "it",
        start: 16.059999465942383,
      },
      {
        end: 16.360000610351562,
        word: "is",
        start: 16.18000030517578,
      },
      {
        end: 16.6200008392334,
        word: "easy",
        start: 16.360000610351562,
      },
      {
        end: 16.81999969482422,
        word: "but",
        start: 16.6200008392334,
      },
      {
        end: 17.079999923706055,
        word: "because",
        start: 16.81999969482422,
      },
      {
        end: 17.200000762939453,
        word: "it",
        start: 17.079999923706055,
      },
      {
        end: 17.420000076293945,
        word: "is",
        start: 17.200000762939453,
      },
      {
        end: 17.700000762939453,
        word: "hard",
        start: 17.420000076293945,
      },
      {
        end: 18.65999984741211,
        word: "Scientists",
        start: 18.65999984741211,
      },
      {
        end: 18.920000076293945,
        word: "at",
        start: 18.65999984741211,
      },
      {
        end: 19.200000762939453,
        word: "NASA",
        start: 18.920000076293945,
      },
      {
        end: 19.68000030517578,
        word: "scrambled",
        start: 19.200000762939453,
      },
      {
        end: 20.68000030517578,
        word: "Computers",
        start: 20.540000915527344,
      },
      {
        end: 20.920000076293945,
        word: "as",
        start: 20.68000030517578,
      },
      {
        end: 21.020000457763672,
        word: "big",
        start: 20.920000076293945,
      },
      {
        end: 21.579999923706055,
        word: "as",
        start: 21.020000457763672,
      },
      {
        end: 21.579999923706055,
        word: "rooms",
        start: 21.579999923706055,
      },
      {
        end: 22.6200008392334,
        word: "Calculations",
        start: 22.200000762939453,
      },
      {
        end: 22.940000534057617,
        word: "by",
        start: 22.6200008392334,
      },
      {
        end: 23.260000228881836,
        word: "hand",
        start: 22.940000534057617,
      },
      {
        end: 23.940000534057617,
        word: "Every",
        start: 23.260000228881836,
      },
      {
        end: 24.420000076293945,
        word: "misstep",
        start: 23.940000534057617,
      },
      {
        end: 24.700000762939453,
        word: "meant",
        start: 24.420000076293945,
      },
      {
        end: 24.940000534057617,
        word: "death",
        start: 24.700000762939453,
      },
      {
        end: 25.6200008392334,
        word: "in",
        start: 24.940000534057617,
      },
      {
        end: 25.6200008392334,
        word: "space",
        start: 25.6200008392334,
      },
      {
        end: 26.200000762939453,
        word: "In",
        start: 26.1200008392334,
      },
      {
        end: 27.200000762939453,
        word: "1969",
        start: 26.200000762939453,
      },
      {
        end: 27.639999389648438,
        word: "tension",
        start: 27.3799991607666,
      },
      {
        end: 28.020000457763672,
        word: "peaked",
        start: 27.639999389648438,
      },
      {
        end: 28.899999618530273,
        word: "Broadcast",
        start: 28.65999984741211,
      },
      {
        end: 29.31999969482422,
        word: "live",
        start: 28.899999618530273,
      },
      {
        end: 30,
        word: "millions",
        start: 29.760000228881836,
      },
      {
        end: 30.239999771118164,
        word: "held",
        start: 30,
      },
      {
        end: 30.760000228881836,
        word: "their",
        start: 30.239999771118164,
      },
      {
        end: 30.799999237060547,
        word: "breath",
        start: 30.760000228881836,
      },
      {
        end: 31.540000915527344,
        word: "Neil",
        start: 31.440000534057617,
      },
      {
        end: 32.2400016784668,
        word: "Armstrong's",
        start: 31.540000915527344,
      },
      {
        end: 32.380001068115234,
        word: "heartbeat",
        start: 32.2400016784668,
      },
      {
        end: 32.70000076293945,
        word: "was",
        start: 32.380001068115234,
      },
      {
        end: 32.97999954223633,
        word: "racing",
        start: 32.70000076293945,
      },
      {
        end: 33.13999938964844,
        word: "as",
        start: 32.97999954223633,
      },
      {
        end: 33.41999816894531,
        word: "he",
        start: 33.13999938964844,
      },
      {
        end: 33.599998474121094,
        word: "descended",
        start: 33.41999816894531,
      },
      {
        end: 34.15999984741211,
        word: "the",
        start: 33.599998474121094,
      },
      {
        end: 34.15999984741211,
        word: "ladder",
        start: 34.15999984741211,
      },
      {
        end: 34.81999969482422,
        word: "The",
        start: 34.400001525878906,
      },
      {
        end: 35.060001373291016,
        word: "Eagle",
        start: 34.81999969482422,
      },
      {
        end: 35.380001068115234,
        word: "has",
        start: 35.060001373291016,
      },
      {
        end: 35.599998474121094,
        word: "landed",
        start: 35.380001068115234,
      },
      {
        end: 36.099998474121094,
        word: "he",
        start: 35.959999084472656,
      },
      {
        end: 36.439998626708984,
        word: "announced",
        start: 36.099998474121094,
      },
      {
        end: 37.279998779296875,
        word: "Then",
        start: 36.97999954223633,
      },
      {
        end: 37.900001525878906,
        word: "that",
        start: 37.7400016784668,
      },
      {
        end: 38.29999923706055,
        word: "historic",
        start: 37.900001525878906,
      },
      {
        end: 38.70000076293945,
        word: "moment",
        start: 38.29999923706055,
      },
      {
        end: 39.47999954223633,
        word: "That's",
        start: 39.2599983215332,
      },
      {
        end: 39.65999984741211,
        word: "one",
        start: 39.47999954223633,
      },
      {
        end: 40,
        word: "small",
        start: 39.65999984741211,
      },
      {
        end: 40.15999984741211,
        word: "step",
        start: 40,
      },
      {
        end: 40.400001525878906,
        word: "for",
        start: 40.15999984741211,
      },
      {
        end: 40.68000030517578,
        word: "man",
        start: 40.400001525878906,
      },
      {
        end: 41.2400016784668,
        word: "one",
        start: 41.02000045776367,
      },
      {
        end: 41.560001373291016,
        word: "giant",
        start: 41.2400016784668,
      },
      {
        end: 41.720001220703125,
        word: "leap",
        start: 41.560001373291016,
      },
      {
        end: 42.52000045776367,
        word: "for",
        start: 41.720001220703125,
      },
      {
        end: 42.52000045776367,
        word: "mankind",
        start: 42.52000045776367,
      },
      {
        end: 43.099998474121094,
        word: "The",
        start: 42.7599983215332,
      },
      {
        end: 43.36000061035156,
        word: "world",
        start: 43.099998474121094,
      },
      {
        end: 43.65999984741211,
        word: "erupted",
        start: 43.36000061035156,
      },
      {
        end: 44.380001068115234,
        word: "in",
        start: 43.65999984741211,
      },
      {
        end: 44.380001068115234,
        word: "cheers",
        start: 44.380001068115234,
      },
      {
        end: 45.119998931884766,
        word: "tears",
        start: 45.119998931884766,
      },
      {
        end: 45.91999816894531,
        word: "America",
        start: 45.599998474121094,
      },
      {
        end: 46.18000030517578,
        word: "made",
        start: 45.91999816894531,
      },
      {
        end: 46.63999938964844,
        word: "it",
        start: 46.18000030517578,
      },
      {
        end: 46.81999969482422,
        word: "But",
        start: 46.63999938964844,
      },
      {
        end: 53.220001220703125,
        word: "the",
        start: 46.81999969482422,
      },
      {
        end: 53.2400016784668,
        word: "real",
        start: 53.220001220703125,
      },
      {
        end: 53.58000183105469,
        word: "All",
        start: 53.2400016784668,
      },
      {
        end: 53.7599983215332,
        word: "from",
        start: 53.58000183105469,
      },
      {
        end: 53.91999816894531,
        word: "a",
        start: 53.7599983215332,
      },
      {
        end: 54.18000030517578,
        word: "moment",
        start: 53.91999816894531,
      },
      {
        end: 54.47999954223633,
        word: "born",
        start: 54.18000030517578,
      },
      {
        end: 54.63999938964844,
        word: "out",
        start: 54.47999954223633,
      },
      {
        end: 54.779998779296875,
        word: "of",
        start: 54.63999938964844,
      },
      {
        end: 55.220001220703125,
        word: "competition",
        start: 54.779998779296875,
      },
      {
        end: 55.540000915527344,
        word: "and",
        start: 55.220001220703125,
      },
      {
        end: 55.81999969482422,
        word: "courage",
        start: 55.540000915527344,
      },
    ],
    duration: 55.81999969482422,
  },
  imagesUrl: [
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=9aba6e3fd0bb53ed62c5a954cb2ce6dcf9930b1614dcda6677c881746159a864&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=bac9f5b937b1f41137ec218db599f8524cd3cfde51dda3caed31e52a43c6c447&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=47dea4ea7d8ef97372e64e99728838fea57a7e717d2761d43020709d4de59fa2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=261eb2b5af2b79d0f9cb0c6c44e6cfa54e860558842db1bc7c70b694016d8f52&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=b86016b906a582f66ea8df427ce9ec453bd67b2f74443eb6bd8ecf86ceb8988a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_5.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=685fa059f1146d1b29bc0582cef972311038952e8acbe6c6c9d0cb7669e6ba8b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/images/scene_6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=e083bec17533f8eaf342c3c883d616d905eb3481daab4cb03bc781d6e73c5845&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  ],
  audioUrl:
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmn4mis7m000gsgl982yao0tx/audio/voiceover.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=509e4c011c0fd57ff1dc2dc559cac6eccd828e0932829b616b988540ff9c692c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  videoUrl:
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/output/shorts/faceless/IBeZWPANnFLz6bBGq4Q6EMeuvA55PhHN/cmn4mis7m000gsgl982yao0tx.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260324%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260324T195539Z&X-Amz-Expires=3600&X-Amz-Signature=a44a5a78c13eca66fe20d02e2212c11f9f4cbb6ea279b1197b9a6c4cb9fcba4d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  backgroundMusicUrl: null,
  createdAt: "2026-03-24T13:01:36.466Z",
  updatedAt: "2026-03-24T18:12:52.936Z",
};

const calculateMetadata: CalculateMetadataFunction<RootProps> = ({ props }) => {
  const duration = props.videoData?.duration ?? 60;
  return {
    durationInFrames: Math.ceil(duration * 30),
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="renderVideo"
      component={RemotionComposition}
      durationInFrames={1680} // placeholder only
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        // @ts-ignore
        videoData: videoData, // no durationInFrames here anymore
      }}
      calculateMetadata={calculateMetadata}
    />
  );
};
