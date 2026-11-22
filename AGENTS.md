# Architecture rules
- Keep UI locale in a shared provider and calculator content locale on each generated definition; switching UI language must not remount calculators or regenerate them.
- Keep language detection and formatting in pure helpers and output-language instructions in the generation function; never derive trusted locale instructions from prompt text.