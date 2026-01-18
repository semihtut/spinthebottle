# Content System (Truth/Dare)

This game is consent-first and party-safe by default. Content is categorized, filterable, and localization-ready.

## Prompt Types
- truth: questions to answer
- dare: short, safe challenges that can be completed in a real room

## Safety Rules (Hard)
Never include:
- illegal activities
- dangerous physical tasks (choking, extreme drinking, fire, sharp objects, heights, driving, etc.)
- hate/harassment, humiliation, slurs
- sexual coercion or explicit sexual content in default packs
- threats, self-harm, or instructions to harm anyone
- "take your clothes off" type content in default packs

## Intensity Scale (1–5)
1: silly, low-stakes, quick
2: light personal, playful
3: slightly bold but still safe and non-sexual
4–5: reserved for optional mature packs (age gated), still consent-first

## Tags
- topics: ["icebreaker","friends","funny","story","preferences","skills","memory","challenge","compliment","creativity"]
- constraints: ["seated","no_touch","no_phone","quiet","small_space"]
- duration_sec: estimated completion time for dares

## Filtering
Given (intensity_max, disabled_topics, constraints_on), only show prompts that:
- intensity <= intensity_max
- topics do not include disabled topics
- constraints are compatible with house rules

## Localization
Store prompts with stable IDs and per-language text.
Never embed cultural references that break translation in core packs.

