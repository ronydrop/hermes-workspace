
cc — Claude Code via OpenRouter
claude — Claude Code via OAuth (direto Anthropic)
Uso: cc [subcomando] [args]

Launch
  cc                     OpenRouter + picker de modelo
  cc run <alias|modelo>  OpenRouter + modelo especifico
  claude                 OAuth direto (Anthropic)

Aliases de run  (custo por milhao de tokens: input/output)
  cc run add <nome> <modelo>  Cria ou edita alias
  cc run rm <nome>            Remove alias
  cc run list                 Lista aliases

Config
  cc status        Mostra config atual
  cc reset         Limpa todas as variaveis
  cc model <slot> <m>  Define modelo
       slots: sonnet | opus | haiku | agent | pack

Uso: cc model sonnet|opus|haiku|agent|pack <valor>
✓ OAuth (Claude direto)
anthropic/claude-opus-4.6-fast	$30.00/$150.00/M	1M
z-ai/glm-5.1	$0.95/$3.15/M	202K
google/gemma-4-26b-a4b-it:free	$0.00/$0.00/M	262K
google/gemma-4-26b-a4b-it	$0.12/$0.40/M	262K
google/gemma-4-31b-it:free	$0.00/$0.00/M	262K
google/gemma-4-31b-it	$0.14/$0.40/M	262K
qwen/qwen3.6-plus	$0.33/$1.95/M	1M
z-ai/glm-5v-turbo	$1.20/$4.00/M	202K
arcee-ai/trinity-large-thinking	$0.22/$0.85/M	262K
x-ai/grok-4.20-multi-agent	$2.00/$6.00/M	2M
x-ai/grok-4.20	$2.00/$6.00/M	2M
google/lyria-3-pro-preview	$0.00/$0.00/M	1M
google/lyria-3-clip-preview	$0.00/$0.00/M	1M
kwaipilot/kat-coder-pro-v2	$0.30/$1.20/M	256K
rekaai/reka-edge	$0.10/$0.10/M	16K
xiaomi/mimo-v2-omni	$0.40/$2.00/M	262K
xiaomi/mimo-v2-pro	$1.00/$3.00/M	1M
minimax/minimax-m2.7	$0.30/$1.20/M	196K
openai/gpt-5.4-nano	$0.20/$1.25/M	400K
openai/gpt-5.4-mini	$0.75/$4.50/M	400K
mistralai/mistral-small-2603	$0.15/$0.60/M	262K
z-ai/glm-5-turbo	$1.20/$4.00/M	202K
nvidia/nemotron-3-super-120b-a12b:free	$0.00/$0.00/M	262K
nvidia/nemotron-3-super-120b-a12b	$0.10/$0.50/M	262K
bytedance-seed/seed-2.0-lite	$0.25/$2.00/M	262K
qwen/qwen3.5-9b	$0.05/$0.15/M	256K
openai/gpt-5.4-pro	$30.00/$180.00/M	1M
openai/gpt-5.4	$2.50/$15.00/M	1M
inception/mercury-2	$0.25/$0.75/M	128K
openai/gpt-5.3-chat	$1.75/$14.00/M	128K
google/gemini-3.1-flash-lite-preview	$0.25/$1.50/M	1M
bytedance-seed/seed-2.0-mini	$0.10/$0.40/M	262K
google/gemini-3.1-flash-image-preview	$0.50/$3.00/M	65K
qwen/qwen3.5-35b-a3b	$0.16/$1.30/M	262K
qwen/qwen3.5-27b	$0.20/$1.56/M	262K
qwen/qwen3.5-122b-a10b	$0.26/$2.08/M	262K
qwen/qwen3.5-flash-02-23	$0.07/$0.26/M	1M
liquid/lfm-2-24b-a2b	$0.03/$0.12/M	32K
google/gemini-3.1-pro-preview-customtools	$2.00/$12.00/M	1M
openai/gpt-5.3-codex	$1.75/$14.00/M	400K
aion-labs/aion-2.0	$0.80/$1.60/M	131K
google/gemini-3.1-pro-preview	$2.00/$12.00/M	1M
anthropic/claude-sonnet-4.6	$3.00/$15.00/M	1M
qwen/qwen3.5-plus-02-15	$0.26/$1.56/M	1M
qwen/qwen3.5-397b-a17b	$0.39/$2.34/M	262K
minimax/minimax-m2.5:free	$0.00/$0.00/M	196K
minimax/minimax-m2.5	$0.12/$0.99/M	196K
z-ai/glm-5	$0.72/$2.30/M	80K
qwen/qwen3-max-thinking	$0.78/$3.90/M	262K
anthropic/claude-opus-4.6	$5.00/$25.00/M	1M
qwen/qwen3-coder-next	$0.15/$0.80/M	262K
openrouter/free	$0.00/$0.00/M	200K
stepfun/step-3.5-flash	$0.10/$0.30/M	262K
arcee-ai/trinity-large-preview:free	$0.00/$0.00/M	131K
moonshotai/kimi-k2.5	$0.38/$1.72/M	262K
upstage/solar-pro-3	$0.15/$0.60/M	128K
minimax/minimax-m2-her	$0.30/$1.20/M	65K
writer/palmyra-x5	$0.60/$6.00/M	1M
liquid/lfm-2.5-1.2b-thinking:free	$0.00/$0.00/M	32K
liquid/lfm-2.5-1.2b-instruct:free	$0.00/$0.00/M	32K
openai/gpt-audio	$2.50/$10.00/M	128K
openai/gpt-audio-mini	$0.60/$2.40/M	128K
z-ai/glm-4.7-flash	$0.06/$0.40/M	202K
openai/gpt-5.2-codex	$1.75/$14.00/M	400K
allenai/olmo-3.1-32b-instruct	$0.20/$0.60/M	65K
bytedance-seed/seed-1.6-flash	$0.07/$0.30/M	262K
bytedance-seed/seed-1.6	$0.25/$2.00/M	262K
minimax/minimax-m2.1	$0.29/$0.95/M	196K
z-ai/glm-4.7	$0.39/$1.75/M	202K
google/gemini-3-flash-preview	$0.50/$3.00/M	1M
mistralai/mistral-small-creative	$0.10/$0.30/M	32K
xiaomi/mimo-v2-flash	$0.09/$0.29/M	262K
nvidia/nemotron-3-nano-30b-a3b:free	$0.00/$0.00/M	256K
nvidia/nemotron-3-nano-30b-a3b	$0.05/$0.20/M	262K
openai/gpt-5.2-chat	$1.75/$14.00/M	128K
openai/gpt-5.2-pro	$21.00/$168.00/M	400K
openai/gpt-5.2	$1.75/$14.00/M	400K
mistralai/devstral-2512	$0.40/$2.00/M	262K
relace/relace-search	$1.00/$3.00/M	256K
z-ai/glm-4.6v	$0.30/$0.90/M	131K
nex-agi/deepseek-v3.1-nex-n1	$0.14/$0.50/M	131K
essentialai/rnj-1-instruct	$0.15/$0.15/M	32K
openrouter/bodybuilder	$-1000000.00/$-1000000.00/M	128K
openai/gpt-5.1-codex-max	$1.25/$10.00/M	400K
amazon/nova-2-lite-v1	$0.30/$2.50/M	1M
mistralai/ministral-14b-2512	$0.20/$0.20/M	262K
mistralai/ministral-8b-2512	$0.15/$0.15/M	262K
mistralai/ministral-3b-2512	$0.10/$0.10/M	131K
mistralai/mistral-large-2512	$0.50/$1.50/M	262K
arcee-ai/trinity-mini	$0.04/$0.15/M	131K
deepseek/deepseek-v3.2-speciale	$0.40/$1.20/M	163K
deepseek/deepseek-v3.2	$0.26/$0.38/M	163K
prime-intellect/intellect-3	$0.20/$1.10/M	131K
anthropic/claude-opus-4.5	$5.00/$25.00/M	200K
allenai/olmo-3-32b-think	$0.15/$0.50/M	65K
google/gemini-3-pro-image-preview	$2.00/$12.00/M	65K
x-ai/grok-4.1-fast	$0.20/$0.50/M	2M
deepcogito/cogito-v2.1-671b	$1.25/$1.25/M	128K
openai/gpt-5.1	$1.25/$10.00/M	400K
openai/gpt-5.1-chat	$1.25/$10.00/M	128K
openai/gpt-5.1-codex	$1.25/$10.00/M	400K
openai/gpt-5.1-codex-mini	$0.25/$2.00/M	400K
moonshotai/kimi-k2-thinking	$0.60/$2.50/M	262K
amazon/nova-premier-v1	$2.50/$12.50/M	1M
perplexity/sonar-pro-search	$3.00/$15.00/M	200K
mistralai/voxtral-small-24b-2507	$0.10/$0.30/M	32K
openai/gpt-oss-safeguard-20b	$0.07/$0.30/M	131K
nvidia/nemotron-nano-12b-v2-vl:free	$0.00/$0.00/M	128K
nvidia/nemotron-nano-12b-v2-vl	$0.20/$0.60/M	131K
minimax/minimax-m2	$0.26/$1.00/M	196K
qwen/qwen3-vl-32b-instruct	$0.10/$0.42/M	131K
ibm-granite/granite-4.0-h-micro	$0.02/$0.11/M	131K
openai/gpt-5-image-mini	$2.50/$2.00/M	400K
anthropic/claude-haiku-4.5	$1.00/$5.00/M	200K
qwen/qwen3-vl-8b-thinking	$0.12/$1.36/M	131K
qwen/qwen3-vl-8b-instruct	$0.08/$0.50/M	131K
openai/gpt-5-image	$10.00/$10.00/M	400K
openai/o3-deep-research	$10.00/$40.00/M	200K
openai/o4-mini-deep-research	$2.00/$8.00/M	200K
nvidia/llama-3.3-nemotron-super-49b-v1.5	$0.10/$0.40/M	131K
baidu/ernie-4.5-21b-a3b-thinking	$0.07/$0.28/M	131K
google/gemini-2.5-flash-image	$0.30/$2.50/M	32K
qwen/qwen3-vl-30b-a3b-thinking	$0.13/$1.56/M	131K
qwen/qwen3-vl-30b-a3b-instruct	$0.13/$0.52/M	131K
openai/gpt-5-pro	$15.00/$120.00/M	400K
z-ai/glm-4.6	$0.39/$1.90/M	204K
anthropic/claude-sonnet-4.5	$3.00/$15.00/M	1M
deepseek/deepseek-v3.2-exp	$0.27/$0.41/M	163K
thedrummer/cydonia-24b-v4.1	$0.30/$0.50/M	131K
relace/relace-apply-3	$0.85/$1.25/M	256K
google/gemini-2.5-flash-lite-preview-09-2025	$0.10/$0.40/M	1M
qwen/qwen3-vl-235b-a22b-thinking	$0.26/$2.60/M	131K
qwen/qwen3-vl-235b-a22b-instruct	$0.20/$0.88/M	262K
qwen/qwen3-max	$0.78/$3.90/M	262K
qwen/qwen3-coder-plus	$0.65/$3.25/M	1M
openai/gpt-5-codex	$1.25/$10.00/M	400K
deepseek/deepseek-v3.1-terminus	$0.21/$0.79/M	163K
x-ai/grok-4-fast	$0.20/$0.50/M	2M
alibaba/tongyi-deepresearch-30b-a3b	$0.09/$0.45/M	131K
qwen/qwen3-coder-flash	$0.20/$0.97/M	1M
qwen/qwen3-next-80b-a3b-thinking	$0.10/$0.78/M	131K
qwen/qwen3-next-80b-a3b-instruct:free	$0.00/$0.00/M	262K
qwen/qwen3-next-80b-a3b-instruct	$0.09/$1.10/M	262K
meituan/longcat-flash-chat	$0.20/$0.80/M	131K
qwen/qwen-plus-2025-07-28:thinking	$0.26/$0.78/M	1M
qwen/qwen-plus-2025-07-28	$0.26/$0.78/M	1M
nvidia/nemotron-nano-9b-v2:free	$0.00/$0.00/M	128K
nvidia/nemotron-nano-9b-v2	$0.04/$0.16/M	131K
moonshotai/kimi-k2-0905	$0.40/$2.00/M	262K
qwen/qwen3-30b-a3b-thinking-2507	$0.08/$0.40/M	131K
x-ai/grok-code-fast-1	$0.20/$1.50/M	256K
nousresearch/hermes-4-70b	$0.13/$0.40/M	131K
nousresearch/hermes-4-405b	$1.00/$3.00/M	131K
deepseek/deepseek-chat-v3.1	$0.15/$0.75/M	32K
openai/gpt-4o-audio-preview	$2.50/$10.00/M	128K
mistralai/mistral-medium-3.1	$0.40/$2.00/M	131K
baidu/ernie-4.5-21b-a3b	$0.07/$0.28/M	120K
baidu/ernie-4.5-vl-28b-a3b	$0.14/$0.56/M	30K
z-ai/glm-4.5v	$0.60/$1.80/M	65K
ai21/jamba-large-1.7	$2.00/$8.00/M	256K
openai/gpt-5-chat	$1.25/$10.00/M	128K
openai/gpt-5	$1.25/$10.00/M	400K
openai/gpt-5-mini	$0.25/$2.00/M	400K
openai/gpt-5-nano	$0.05/$0.40/M	400K
openai/gpt-oss-120b:free	$0.00/$0.00/M	131K
openai/gpt-oss-120b	$0.04/$0.19/M	131K
openai/gpt-oss-20b:free	$0.00/$0.00/M	131K
openai/gpt-oss-20b	$0.03/$0.14/M	131K
anthropic/claude-opus-4.1	$15.00/$75.00/M	200K
mistralai/codestral-2508	$0.30/$0.90/M	256K
qwen/qwen3-coder-30b-a3b-instruct	$0.07/$0.27/M	160K
qwen/qwen3-30b-a3b-instruct-2507	$0.09/$0.30/M	262K
z-ai/glm-4.5	$0.60/$2.20/M	131K
z-ai/glm-4.5-air:free	$0.00/$0.00/M	131K
z-ai/glm-4.5-air	$0.13/$0.85/M	131K
qwen/qwen3-235b-a22b-thinking-2507	$0.15/$1.50/M	131K
z-ai/glm-4-32b	$0.10/$0.10/M	128K
qwen/qwen3-coder:free	$0.00/$0.00/M	262K
qwen/qwen3-coder	$0.22/$1.00/M	262K
bytedance/ui-tars-1.5-7b	$0.10/$0.20/M	128K
google/gemini-2.5-flash-lite	$0.10/$0.40/M	1M
qwen/qwen3-235b-a22b-2507	$0.07/$0.10/M	262K
switchpoint/router	$0.85/$3.40/M	131K
moonshotai/kimi-k2	$0.57/$2.30/M	131K
mistralai/devstral-medium	$0.40/$2.00/M	131K
mistralai/devstral-small	$0.10/$0.30/M	131K
cognitivecomputations/dolphin-mistral-24b-venice-edition:free	$0.00/$0.00/M	32K
x-ai/grok-4	$3.00/$15.00/M	256K
google/gemma-3n-e2b-it:free	$0.00/$0.00/M	8K
tencent/hunyuan-a13b-instruct	$0.14/$0.57/M	131K
tngtech/deepseek-r1t2-chimera	$0.30/$1.10/M	163K
morph/morph-v3-large	$0.90/$1.90/M	262K
morph/morph-v3-fast	$0.80/$1.20/M	81K
baidu/ernie-4.5-vl-424b-a47b	$0.42/$1.25/M	123K
baidu/ernie-4.5-300b-a47b	$0.28/$1.10/M	123K
inception/mercury	$0.25/$0.75/M	128K
mistralai/mistral-small-3.2-24b-instruct	$0.07/$0.20/M	128K
minimax/minimax-m1	$0.40/$2.20/M	1M
google/gemini-2.5-flash	$0.30/$2.50/M	1M
google/gemini-2.5-pro	$1.25/$10.00/M	1M
openai/o3-pro	$20.00/$80.00/M	200K
x-ai/grok-3-mini	$0.30/$0.50/M	131K
x-ai/grok-3	$3.00/$15.00/M	131K
google/gemini-2.5-pro-preview	$1.25/$10.00/M	1M
deepseek/deepseek-r1-0528	$0.50/$2.15/M	163K
anthropic/claude-opus-4	$15.00/$75.00/M	200K
anthropic/claude-sonnet-4	$3.00/$15.00/M	1M
google/gemma-3n-e4b-it:free	$0.00/$0.00/M	8K
google/gemma-3n-e4b-it	$0.02/$0.04/M	32K
mistralai/mistral-medium-3	$0.40/$2.00/M	131K
google/gemini-2.5-pro-preview-05-06	$1.25/$10.00/M	1M
arcee-ai/spotlight	$0.18/$0.18/M	131K
arcee-ai/maestro-reasoning	$0.90/$3.30/M	131K
arcee-ai/virtuoso-large	$0.75/$1.20/M	131K
arcee-ai/coder-large	$0.50/$0.80/M	32K
inception/mercury-coder	$0.25/$0.75/M	128K
meta-llama/llama-guard-4-12b	$0.18/$0.18/M	163K
qwen/qwen3-30b-a3b	$0.08/$0.28/M	40K
qwen/qwen3-8b	$0.05/$0.40/M	40K
qwen/qwen3-14b	$0.06/$0.24/M	40K
qwen/qwen3-32b	$0.08/$0.24/M	40K
qwen/qwen3-235b-a22b	$0.45/$1.82/M	131K
openai/o4-mini-high	$1.10/$4.40/M	200K
openai/o3	$2.00/$8.00/M	200K
openai/o4-mini	$1.10/$4.40/M	200K
qwen/qwen2.5-coder-7b-instruct	$0.03/$0.09/M	32K
openai/gpt-4.1	$2.00/$8.00/M	1M
openai/gpt-4.1-mini	$0.40/$1.60/M	1M
openai/gpt-4.1-nano	$0.10/$0.40/M	1M
alfredpros/codellama-7b-instruct-solidity	$0.80/$1.20/M	4K
x-ai/grok-3-mini-beta	$0.30/$0.50/M	131K
x-ai/grok-3-beta	$3.00/$15.00/M	131K
nvidia/llama-3.1-nemotron-ultra-253b-v1	$0.60/$1.80/M	131K
meta-llama/llama-4-maverick	$0.15/$0.60/M	1M
meta-llama/llama-4-scout	$0.08/$0.30/M	327K
qwen/qwen2.5-vl-32b-instruct	$0.20/$0.60/M	128K
deepseek/deepseek-chat-v3-0324	$0.20/$0.77/M	163K
openai/o1-pro	$150.00/$600.00/M	200K
mistralai/mistral-small-3.1-24b-instruct	$0.35/$0.56/M	128K
allenai/olmo-2-0325-32b-instruct	$0.05/$0.20/M	128K
google/gemma-3-4b-it:free	$0.00/$0.00/M	32K
google/gemma-3-4b-it	$0.04/$0.08/M	131K
google/gemma-3-12b-it:free	$0.00/$0.00/M	32K
google/gemma-3-12b-it	$0.04/$0.13/M	131K
cohere/command-a	$2.50/$10.00/M	256K
openai/gpt-4o-mini-search-preview	$0.15/$0.60/M	128K
openai/gpt-4o-search-preview	$2.50/$10.00/M	128K
rekaai/reka-flash-3	$0.10/$0.20/M	65K
google/gemma-3-27b-it:free	$0.00/$0.00/M	131K
google/gemma-3-27b-it	$0.08/$0.16/M	131K
thedrummer/skyfall-36b-v2	$0.55/$0.80/M	32K
perplexity/sonar-reasoning-pro	$2.00/$8.00/M	128K
perplexity/sonar-pro	$3.00/$15.00/M	200K
perplexity/sonar-deep-research	$2.00/$8.00/M	128K
qwen/qwq-32b	$0.15/$0.58/M	131K
google/gemini-2.0-flash-lite-001	$0.07/$0.30/M	1M
anthropic/claude-3.7-sonnet	$3.00/$15.00/M	200K
anthropic/claude-3.7-sonnet:thinking	$3.00/$15.00/M	200K
mistralai/mistral-saba	$0.20/$0.60/M	32K
meta-llama/llama-guard-3-8b	$0.02/$0.06/M	131K
openai/o3-mini-high	$1.10/$4.40/M	200K
google/gemini-2.0-flash-001	$0.10/$0.40/M	1M
qwen/qwen-vl-plus	$0.14/$0.41/M	131K
aion-labs/aion-1.0	$4.00/$8.00/M	131K
aion-labs/aion-1.0-mini	$0.70/$1.40/M	131K
aion-labs/aion-rp-llama-3.1-8b	$0.80/$1.60/M	32K
qwen/qwen-vl-max	$0.52/$2.08/M	131K
qwen/qwen-turbo	$0.03/$0.13/M	131K
qwen/qwen2.5-vl-72b-instruct	$0.80/$0.80/M	32K
qwen/qwen-plus	$0.26/$0.78/M	1M
qwen/qwen-max	$1.04/$4.16/M	32K
openai/o3-mini	$1.10/$4.40/M	200K
mistralai/mistral-small-24b-instruct-2501	$0.05/$0.08/M	32K
deepseek/deepseek-r1-distill-qwen-32b	$0.29/$0.29/M	32K
perplexity/sonar	$1.00/$1.00/M	127K
deepseek/deepseek-r1-distill-llama-70b	$0.70/$0.80/M	131K
deepseek/deepseek-r1	$0.70/$2.50/M	64K
minimax/minimax-01	$0.20/$1.10/M	1M
microsoft/phi-4	$0.07/$0.14/M	16K
sao10k/l3.1-70b-hanami-x1	$3.00/$3.00/M	16K
deepseek/deepseek-chat	$0.32/$0.89/M	163K
sao10k/l3.3-euryale-70b	$0.65/$0.75/M	131K
openai/o1	$15.00/$60.00/M	200K
cohere/command-r7b-12-2024	$0.04/$0.15/M	128K
meta-llama/llama-3.3-70b-instruct:free	$0.00/$0.00/M	65K
meta-llama/llama-3.3-70b-instruct	$0.10/$0.32/M	131K
amazon/nova-lite-v1	$0.06/$0.24/M	300K
amazon/nova-micro-v1	$0.04/$0.14/M	128K
amazon/nova-pro-v1	$0.80/$3.20/M	300K
openai/gpt-4o-2024-11-20	$2.50/$10.00/M	128K
mistralai/mistral-large-2411	$2.00/$6.00/M	131K
mistralai/mistral-large-2407	$2.00/$6.00/M	131K
mistralai/pixtral-large-2411	$2.00/$6.00/M	131K
qwen/qwen-2.5-coder-32b-instruct	$0.66/$1.00/M	32K
thedrummer/unslopnemo-12b	$0.40/$0.40/M	32K
anthropic/claude-3.5-haiku	$0.80/$4.00/M	200K
anthracite-org/magnum-v4-72b	$3.00/$5.00/M	16K
qwen/qwen-2.5-7b-instruct	$0.04/$0.10/M	32K
nvidia/llama-3.1-nemotron-70b-instruct	$1.20/$1.20/M	131K
inflection/inflection-3-productivity	$2.50/$10.00/M	8K
inflection/inflection-3-pi	$2.50/$10.00/M	8K
thedrummer/rocinante-12b	$0.17/$0.43/M	32K
meta-llama/llama-3.2-3b-instruct:free	$0.00/$0.00/M	131K
meta-llama/llama-3.2-3b-instruct	$0.05/$0.34/M	80K
meta-llama/llama-3.2-1b-instruct	$0.03/$0.20/M	60K
meta-llama/llama-3.2-11b-vision-instruct	$0.24/$0.24/M	131K
qwen/qwen-2.5-72b-instruct	$0.12/$0.39/M	32K
cohere/command-r-plus-08-2024	$2.50/$10.00/M	128K
cohere/command-r-08-2024	$0.15/$0.60/M	128K
sao10k/l3.1-euryale-70b	$0.85/$0.85/M	131K
nousresearch/hermes-3-llama-3.1-70b	$0.30/$0.30/M	131K
nousresearch/hermes-3-llama-3.1-405b:free	$0.00/$0.00/M	131K
nousresearch/hermes-3-llama-3.1-405b	$1.00/$1.00/M	131K
sao10k/l3-lunaris-8b	$0.04/$0.05/M	8K
openai/gpt-4o-2024-08-06	$2.50/$10.00/M	128K
meta-llama/llama-3.1-8b-instruct	$0.02/$0.05/M	16K
meta-llama/llama-3.1-70b-instruct	$0.40/$0.40/M	131K
mistralai/mistral-nemo	$0.02/$0.04/M	131K
openai/gpt-4o-mini-2024-07-18	$0.15/$0.60/M	128K
openai/gpt-4o-mini	$0.15/$0.60/M	128K
google/gemma-2-27b-it	$0.65/$0.65/M	8K
google/gemma-2-9b-it	$0.03/$0.09/M	8K
sao10k/l3-euryale-70b	$1.48/$1.48/M	8K
nousresearch/hermes-2-pro-llama-3-8b	$0.14/$0.14/M	8K
openai/gpt-4o-2024-05-13	$5.00/$15.00/M	128K
openai/gpt-4o	$2.50/$10.00/M	128K
openai/gpt-4o:extended	$6.00/$18.00/M	128K
meta-llama/llama-3-8b-instruct	$0.03/$0.04/M	8K
meta-llama/llama-3-70b-instruct	$0.51/$0.74/M	8K
mistralai/mixtral-8x22b-instruct	$2.00/$6.00/M	65K
microsoft/wizardlm-2-8x22b	$0.62/$0.62/M	65K
openai/gpt-4-turbo	$10.00/$30.00/M	128K
anthropic/claude-3-haiku	$0.25/$1.25/M	200K
mistralai/mistral-large	$2.00/$6.00/M	128K
openai/gpt-4-turbo-preview	$10.00/$30.00/M	128K
openai/gpt-3.5-turbo-0613	$1.00/$2.00/M	4K
mistralai/mixtral-8x7b-instruct	$0.54/$0.54/M	32K
alpindale/goliath-120b	$3.75/$7.50/M	6K
openrouter/auto	$-1000000.00/$-1000000.00/M	2M
openai/gpt-4-1106-preview	$10.00/$30.00/M	128K
openai/gpt-3.5-turbo-instruct	$1.50/$2.00/M	4K
mistralai/mistral-7b-instruct-v0.1	$0.11/$0.19/M	2K
openai/gpt-3.5-turbo-16k	$3.00/$4.00/M	16K
mancer/weaver	$0.75/$1.00/M	8K
undi95/remm-slerp-l2-13b	$0.45/$0.65/M	6K
gryphe/mythomax-l2-13b	$0.06/$0.06/M	4K
openai/gpt-4-0314	$30.00/$60.00/M	8K
openai/gpt-4	$30.00/$60.00/M	8K
openai/gpt-3.5-turbo	$0.50/$1.50/M	16K

[1mEscolha o modelo OpenRouter[0m

[?25l[?12l[?25h
[2mmodelo padrao[0m

  (nenhum alias)
/**
 * Hermes Config API — read/write ~/.hermes/config.yaml and ~/.hermes/.env
 * Gives the web UI the same config power as `hermes setup`
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { createFileRoute } from '@tanstack/react-router'
import YAML from 'yaml'
import { isAuthenticated } from '../../server/auth-middleware'
import {
  ensureGatewayProbed,
  getCapabilities,
} from '../../server/gateway-capabilities'
import { createCapabilityUnavailablePayload } from '@/lib/feature-gates'

type AuthResult = Response | true

const HERMES_HOME = path.join(os.homedir(), '.hermes')
const CONFIG_PATH = path.join(HERMES_HOME, 'config.yaml')
const ENV_PATH = path.join(HERMES_HOME, '.env')

// Known Hermes providers
const PROVIDERS = [
  { id: 'nous', name: 'Nous Portal', authType: 'oauth', envKeys: [] },
  { id: 'openai-codex', name: 'OpenAI Codex', authType: 'oauth', envKeys: [] },
  {
    id: 'anthropic',
    name: 'Anthropic',
    authType: 'api_key',
    envKeys: ['ANTHROPIC_API_KEY', 'ANTHROPIC_TOKEN'],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    authType: 'api_key',
    envKeys: ['OPENROUTER_API_KEY'],
  },
  {
    id: 'zai',
    name: 'Z.AI / GLM',
    authType: 'api_key',
    envKeys: ['GLM_API_KEY'],
  },
  {
    id: 'kimi-coding',
    name: 'Kimi / Moonshot',
    authType: 'api_key',
    envKeys: ['KIMI_API_KEY'],
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    authType: 'api_key',
    envKeys: ['MINIMAX_API_KEY'],
  },
  {
    id: 'minimax-cn',
    name: 'MiniMax (China)',
    authType: 'api_key',
    envKeys: ['MINIMAX_CN_API_KEY'],
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi MiMo',
    authType: 'api_key',
    envKeys: ['XIAOMI_API_KEY'],
  },
  { id: 'ollama', name: 'Ollama (Local)', authType: 'none', envKeys: [] },
  {
    id: 'custom',
    name: 'Custom OpenAI-compatible',
    authType: 'api_key',
    envKeys: [],
  },
]

function readConfig(): Record<string, unknown> {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
    return (YAML.parse(raw) as Record<string, unknown>) || {}
  } catch {
    return {}
  }
}

function writeConfig(config: Record<string, unknown>): void {
  fs.mkdirSync(HERMES_HOME, { recursive: true })
  fs.writeFileSync(CONFIG_PATH, YAML.stringify(config), 'utf-8')
}

function readEnv(): Record<string, string> {
  try {
    const raw = fs.readFileSync(ENV_PATH, 'utf-8')
    const env: Record<string, string> = {}
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim()
        let value = trimmed.slice(eqIdx + 1).trim()
        // Strip quotes
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1)
        }
        env[key] = value
      }
    }
    return env
  } catch {
    return {}
  }
}

function writeEnv(env: Record<string, string>): void {
  fs.mkdirSync(HERMES_HOME, { recursive: true })
  const lines = Object.entries(env).map(([k, v]) => `${k}=${v}`)
  fs.writeFileSync(ENV_PATH, lines.join('\n') + '\n', 'utf-8')
}

function maskKey(key: string): string {
  const clean = key.replace(/[^\x20-\x7E]/g, '').trim()
  if (!clean || clean.length < 8) return '***'
  return clean.slice(0, 4) + '...' + clean.slice(-4)
}

function checkAuthStore(providerId: string): {
  hasToken: boolean
  source: string
  maskedKey?: string
} {
  // Check Hermes auth store
  for (const storePath of [
    path.join(os.homedir(), '.hermes', 'auth-profiles.json'),
    path.join(
      os.homedir(),
      '.openclaw',
      'agents',
      'main',
      'agent',
      'auth-profiles.json',
    ),
  ]) {
    try {
      if (!fs.existsSync(storePath)) continue
      const store = JSON.parse(fs.readFileSync(storePath, 'utf-8'))
      const profiles = store?.profiles || {}
      for (const [key, value] of Object.entries(profiles)) {
        if (!key.startsWith(`${providerId}:`)) continue
        if (typeof value !== 'object' || value === null) continue
        const p = value as Record<string, unknown>
        const token = String(p.token || p.key || p.access || '').trim()
        if (token) {
          const source = storePath.includes('.hermes')
            ? 'hermes-auth-store'
            : 'openclaw-auth-store'
          return { hasToken: true, source, maskedKey: maskKey(token) }
        }
      }
    } catch {}
  }
  return { hasToken: false, source: '' }
}

export const Route = createFileRoute('/api/hermes-config')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authResult = isAuthenticated(request) as AuthResult
        if (authResult !== true) return authResult
        await ensureGatewayProbed()
        if (!getCapabilities().config) {
          return Response.json({
            ...createCapabilityUnavailablePayload('config'),
            config: {},
            providers: [],
            activeProvider: '',
            activeModel: '',
            hermesHome: HERMES_HOME,
          })
        }

        const config = readConfig()
        const env = readEnv()

        // Build provider status
        const providerStatus = PROVIDERS.map((p) => {
          const hasEnvKey =
            p.envKeys.length === 0 || p.envKeys.some((k) => !!env[k])
          const authStoreCheck = checkAuthStore(p.id)
          const hasKey =
            hasEnvKey || authStoreCheck.hasToken || p.authType === 'none'
          const maskedKeys: Record<string, string> = {}
          for (const k of p.envKeys) {
            if (env[k]) maskedKeys[k] = maskKey(env[k])
          }
          if (authStoreCheck.hasToken && authStoreCheck.maskedKey) {
            maskedKeys['auth-store'] = authStoreCheck.maskedKey
          }
          return {
            ...p,
            configured: hasKey,
            authSource: authStoreCheck.hasToken
              ? authStoreCheck.source
              : hasEnvKey
                ? 'env'
                : 'none',
            maskedKeys,
          }
        })

        // Get active provider/model from config
        // Support both flat keys (model: "gpt-5.4", provider: "openai-codex")
        // and legacy nested format (model: { default: "...", provider: "..." })
        const modelField = config.model
        let activeModel = ''
        let activeProvider = ''
        if (typeof modelField === 'string') {
          activeModel = modelField
          activeProvider = (config.provider as string) || ''
        } else if (modelField && typeof modelField === 'object') {
          const modelObj = modelField as Record<string, unknown>
          activeModel = (modelObj.default as string) || ''
          activeProvider =
            (modelObj.provider as string) || (config.provider as string) || ''
        }

        return Response.json({
          config,
          providers: providerStatus,
          activeProvider,
          activeModel,
          hermesHome: HERMES_HOME,
        })
      },

      PATCH: async ({ request }) => {
        const authResult = isAuthenticated(request) as AuthResult
        if (authResult !== true) return authResult
        await ensureGatewayProbed()
        if (!getCapabilities().config) {
          return new Response(
            JSON.stringify(
              createCapabilityUnavailablePayload('config', {
                error: 'Configuration updates are unavailable on this backend.',
              }),
            ),
            { status: 503, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const body = (await request.json()) as Record<string, unknown>

        // Handle config updates
        if (body.config && typeof body.config === 'object') {
          const current = readConfig()
          const updates = body.config as Record<string, unknown>

          // Deep merge
          function deepMerge(
            target: Record<string, unknown>,
            source: Record<string, unknown>,
          ) {
            for (const [key, value] of Object.entries(source)) {
              if (
                value &&
                typeof value === 'object' &&
                !Array.isArray(value) &&
                target[key] &&
                typeof target[key] === 'object'
              ) {
                deepMerge(
                  target[key] as Record<string, unknown>,
                  value as Record<string, unknown>,
                )
              } else {
                target[key] = value
              }
            }
          }

          // Handle null values as explicit removals
          for (const [key, value] of Object.entries(updates)) {
            if (value === null) {
              delete current[key]
              delete updates[key]
            }
          }
          deepMerge(current, updates)
          writeConfig(current)
        }

        // Handle env var updates
        if (body.env && typeof body.env === 'object') {
          const currentEnv = readEnv()
          const envUpdates = body.env as Record<string, string>
          for (const [key, value] of Object.entries(envUpdates)) {
            if (value === '' || value === null) {
              delete currentEnv[key]
            } else {
              currentEnv[key] = value
            }
          }
          writeEnv(currentEnv)
        }

        return Response.json({
          ok: true,
          message: 'Config updated. Restart Hermes to apply changes.',
        })
      },
    },
  },
})
