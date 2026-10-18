# Evaluation

No learning-impact, accuracy, time-saving, cost, or benchmark-quality claim has been measured yet.

Included deterministic checks cover concise correct explanations, uncertain transcription, zero-denominator misconception, exact revision duration, and stale/repeated acceptance.

One deployment smoke test on 17 October 2026 used live Vertex AI `gemini-2.5-flash` with the synthetic rational-numbers recap. The structured response passed runtime validation and contained 6 notes, 4 quiz questions, and 3 concept-map nodes. This proves connectivity and schema compliance only; it is not an accuracy benchmark. Anonymous access to the endpoint returned 401.

Planned: an adult-authored synthetic held-out set for demonstrated, likely misconception, incomplete, insufficient evidence, and uncertain transcription. Compare the same Gemini model in single-pass and up-to-three-follow-up workflows. Report agreement, false misconception flags, unresolved cases, raw token use, latency, and limitations. Do not present synthetic follow-ups as student validation; verify pricing before cost estimates.
