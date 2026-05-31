# Imagr

**An AI-powered prompt compiler for diffusion-based image generation.**

Imagr transforms incomplete user ideas into structured, weighted, and model-ready prompts that improve consistency, clarity, and creative control across multiple image generation models.

Live Demo: [imagr.parth3083.live](https://imagr.parth3083.live/)

---

## Table of Contents

- [Overview](#overview)
- [Problem](#problem)
- [Solution](#solution)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Supported Models](#supported-models)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [References](#references)
- [License](#license)
- [Author](#author)

---

## Overview

Modern image generation systems rely on prompt syntax, weighting, and parser-specific rules, but most users only provide short, natural-language ideas. This creates ambiguity, conflicting instructions, and inconsistent results across models. Imagr acts as an intelligent compilation layer between the user's creative intent and the image generation model, producing optimized prompts that are structured, weighted, and adapted to each model's dialect.

---

## Problem

Users face three core issues when working with AI image generators:

1. **Vague prompts produce unpredictable results.** A prompt like "a cat in rain" gives the model no guidance on what to emphasize, what style to use, or what to avoid.

2. **Every model expects different syntax.** Stable Diffusion uses parenthetical weight syntax like `(token:1.3)`, Flux relies on natural language emphasis, and GPT Image ignores weight syntax entirely. Users must learn and rewrite prompts for each engine.

3. **No existing tool handles automated weight assignment.** Tools like Fooocus and Promptist expand and enhance prompts, but none assign visual importance weights to tokens based on compositional hierarchy.

---

## Solution

Imagr is an AI-powered prompt IDE that converts a rough creative idea into a structured, weighted, model-ready image prompt. It analyzes intent, detects ambiguity, resolves conflicts, and generates optimized output for Stable Diffusion, Flux, ComfyUI, and GPT Image.

The system also creates a negative prompt, assigns a quality score, and adapts tone for consistency across models. Instead of forcing users to learn complex weighting syntax, Imagr acts as a creative copilot that rewrites, refines, and routes prompts into the correct model dialect.

---

## Features

### Prompt Blueprint

Breaks the user's idea into structured categories: subject, scene, mood, lighting, composition, camera, style, color palette, and details. Each category is tagged as user-provided or AI-inferred, enabling full transparency over what the compiler added.

### Smart Weight Assignment

Assigns emphasis weights (1.0 to 1.5) to tokens based on a visual importance hierarchy. The main subject receives the highest weight, mood drivers come second, style modifiers third, and background context stays at baseline. This ensures the diffusion model focuses on what matters most.

### Negative Prompt Generator

Generates exclusion prompts that are reactive to the positive prompt rather than relying on generic templates. If the subject is a person, anatomy-related artifacts are excluded. If the style is photorealistic, cartoon and illustration styles are negated.

### Model Router

Converts the same creative intent into model-specific prompt formats:

- **Stable Diffusion**: Parenthetical weight syntax `(token:1.3)`
- **Flux**: Natural language emphasis through word order and description length
- **ComfyUI**: Compel-compatible weight syntax
- **GPT Image**: Descriptive prose with positional emphasis

### Prompt Linter

Detects vague language, contradictions, repetition, weight conflicts, and missing visual details before the prompt is sent to any model. Issues are surfaced as warnings with severity levels and actionable suggestions.

### Style Presets

Reusable creative directions that control the weighting strategy. Aggressive style pushes weights higher for dramatic focus. Conservative style keeps weights minimal for safer, more predictable outputs. Custom presets can be saved and reused across sessions.

### Prompt Arena

Compares multiple prompt variants side by side. Users can generate variants with different styles, vote on the best output, and view a diff of what the compiler changed in each version.

### Quality Score

Rates each compiled prompt on three dimensions: specificity (how detailed and concrete), coherence (whether instructions conflict), and weight distribution (whether the hierarchy is clear). Returns an overall score from 0 to 100.

### Lock Words

Allows users to lock specific tokens at fixed weights that the compiler cannot override. This gives advanced users precise control over individual elements while letting the compiler optimize everything else.

---

## How It Works

The compilation pipeline runs in two stages followed by a deterministic formatting step.

### Stage 1: Analyze and Expand

The raw user prompt is sent to the LLM, which breaks it into a structured Blueprint. Missing categories are inferred from context. Each field is marked with its source (user-provided or AI-inferred) and a confidence score. The output is a structured JSON object, not a formatted prompt.

### Stage 2: Weight, Score, and Negate

The Blueprint is passed to a second LLM call along with the selected prompt style and any lock words. The LLM assigns token-level weights based on the visual importance hierarchy, generates a reactive negative prompt, scores the prompt quality, and returns lint warnings for any detected issues.

### Stage 3: Model Router (No LLM)

A pure code formatter takes the weighted token array and converts it into the target model's syntax. This step requires no LLM call and runs deterministically.

```
Raw Prompt
    |
    v
[Skill 1: Analyze & Expand] --> Blueprint JSON
    |
    v
[Skill 2: Weight, Score & Negate] --> Weighted Tokens + Negative Prompt + Score
    |
    v
[Model Router] --> SD / Flux / ComfyUI / GPT Image formatted output
```

---

## Tech Stack

| Layer        | Technology                       |
| ------------ | -------------------------------- |
| Frontend     | Next.js (App Router), TypeScript |
| Styling      | Tailwind CSS                     |
| AI SDK       | Vercel AI SDK                    |
| LLM Provider | IBM Granite                      |
| Backend      | ElysiaJS                         |
| Database     | PostgreSQL                       |
| Auth         | Clerk                            |
| Deployment   | Vercel                           |

---

## Architecture

```
Client (Next.js)
    |
    |--- API Routes (Server Actions)
    |        |
    |        |--- Skill 1: Analyze & Expand
    |        |       |--- Vercel AI SDK -> generateObject()
    |        |       |--- Zod Schema Validation (Blueprint)
    |        |       |--- IBM Granite (LLM)
    |        |
    |        |--- Skill 2: Weight, Score & Negate
    |        |       |--- Vercel AI SDK -> generateObject()
    |        |       |--- Zod Schema Validation (Weighted Output)
    |        |       |--- IBM Granite (LLM)
    |        |
    |        |--- Model Router (Pure TypeScript)
    |                |--- formatForSD()
    |                |--- formatForFlux()
    |                |--- formatForComfyUI()
    |                |--- formatForGPTImage()
    |
    |--- ElysiaJS Backend
    |        |--- PostgreSQL
    |        |--- Users, Conversations, Styles, Models,
    |        |    Lock Words, Prompt Styles
    |
    v
  Vercel (Deployment)
```

---

## Database Schema

The application uses the following tables:

**users** - id, name, email, created_at

**company** - id, name, website

**models** - id, name, company_id (FK)

**prompt_styles** - id, name, description

**styles** - id, name, style_system_prompt, model_id (FK, nullable), tags

**lock_words** - id, word, format

**style_locked_words** - id, style_id (FK), locked_word_id (FK)

**conversations** - id, user_id (FK), model_id (FK), prompt_style_id (FK), style_id (FK), input_prompt, output_prompt, negative_prompt, quality_score, lint_warnings, created_at

**prompt_variants** - id, conversation_id (FK), variant_prompt, negative_prompt, quality_score, vote_count, is_winner, created_at

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL
- IBM Granite API key (or any LLM provider supported by Vercel AI SDK)

### Installation

```bash
git clone https://github.com/Parth3083/Imagr.git
cd Imagr
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=your_postgresql_connection_string
IBM_GRANITE_API_KEY=your_api_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Run Database Migrations

```bash
npx prisma migrate dev
```

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Project Structure

```
imagr/
  src/
    app/
      (auth)/           # Authentication pages
      (dashboard)/      # Protected dashboard routes
        prompt-studio/  # Main prompt editor (Page 2)
        prompt-arena/   # Variant comparison (Page 3)
        style-library/  # Reusable presets (Page 4)
      api/              # API routes
    components/         # Shared UI components
    lib/
      skills/
        analyze.ts      # Skill 1: Analyze and Expand
        weight.ts       # Skill 2: Weight, Score, and Negate
      router/
        index.ts        # Model Router formatters
      schemas/
        blueprint.ts    # Zod schema for Blueprint
        weighted.ts     # Zod schema for Weighted Output
      db/               # Database client and queries
    types/              # TypeScript type definitions
  prisma/
    schema.prisma       # Database schema
  public/               # Static assets
```

---

## Supported Models

| Model              | Weight Syntax     | Status    |
| ------------------ | ----------------- | --------- |
| Stable Diffusion   | (token:1.3)       | Supported |
| Flux               | Natural language  | Supported |
| ComfyUI            | Compel syntax     | Supported |
| GPT Image (DALL-E) | Descriptive prose | Supported |
| Midjourney         | Parameter flags   | Planned   |

---

## Screenshots

Screenshots of the application are available at [imagr.parth3083.live](https://imagr.parth3083.live/).

---

## Roadmap

- Projects and Export Center for managing saved work and final exports
- Campaign Mode for generating multiple related prompts from a single idea
- Public API for developers to integrate Imagr into their workflows
- Community marketplace for sharing and discovering style presets
- Fine-tuned model for weight assignment to replace general-purpose LLM calls
- Batch compilation for processing multiple prompts in a single operation

---

## References

The following open-source projects and research informed the design and architecture of Imagr:

- **Fooocus** by lllyasviel - GPT-2 based prompt expansion engine. Studied `extras/expansion.py` for understanding how prompt enhancement works at the token level.
- **Microsoft Promptist** - Reinforcement learning approach to rewriting prompts for improved image quality. Informed the quality scoring methodology.
- **sd-dynamic-prompts** by adieyal - Multi-model prompt generation extension for AUTOMATIC1111. Studied the model registry pattern and template engine for the Model Router architecture.
- **Compel** by damian0815 - Prompt weighting library for diffusion models. Referenced for understanding how weights translate into CLIP embeddings.
- **AUTOMATIC1111 stable-diffusion-webui** - Reference implementation for prompt weight parsing via `prompt_parser.py`.
- **webui-fooocus-prompt-expansion** by power88 - Standalone extraction of the Fooocus expansion module. Used as reference for isolating expansion logic from the broader pipeline.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

**Parth Rajput**

- Website: [parth-rajput.dev](https://parth-rajput.dev)
- Live Demo: [imagr.parth3083.live](https://imagr.parth3083.live/)
- GitHub: [github.com/Parth3083](https://github.com/Parth3083)
