# Rails + Inertia + React + TypeScript Boilerplate

A Rails 8 boilerplate with Inertia.js, React 19, TypeScript, Chakra UI, and a fully configured dev toolchain.

## Stack

- **Rails 8.1** — SQLite (dev/test), Solid Queue, Solid Cache, Solid Cable
- **Vite** via `vite_rails` — fast HMR, path aliases (`@/`)
- **Inertia.js** — server-driven SPA without a separate API
- **React 19 + TypeScript** — strict mode, `react-jsx` transform
- **Chakra UI v3** — component library with custom theme + dark/light mode
- **OJ + oj_serializers** — fast JSON serialization
- **types_from_serializers** — auto-generates TypeScript interfaces from serializers
- **js-routes** — typed Rails route helpers in TypeScript (ESM, auto-regenerated in dev)
- **RSpec** + Factory Bot + Shoulda Matchers + WebMock
- **ESLint v9** (flat config) + Prettier + RuboCop (Omakase)

---

## LLM Setup Prompt

Use the prompt below to have an LLM reproduce this boilerplate from scratch.

---

```
Set up a new Rails 8 application with the following stack and configuration. Apply every change described below exactly.

---

## Application

rails new <app_name> \
  --database=sqlite3 \
  --skip-hotwire \
  --skip-jbuilder \
  --skip-system-test \
  --asset-pipeline=vite

---

## Gems (Gemfile)

Add to the top-level:
  gem "dotenv", groups: [:development, :test]
  gem "oj"
  gem "oj_serializers"
  gem "types_from_serializers"
  gem "js-routes"
  gem "faker"
  gem "inertia_rails", "~> 3.6"
  gem "vite_rails", "~> 3.0"

Add to group :development, :test:
  gem "factory_bot_rails"
  gem "rspec-rails"

Add to group :development:
  gem "letter_opener_web"

Add to group :test:
  gem "shoulda-matchers", "~> 6.0"
  gem "webmock"

Run: bundle install
Run: bundle exec rails generate rspec:install

---

## Frontend directory

The frontend source lives at app/javascript (not app/frontend).
Set config/vite.json → "sourceCodeDir": "app/javascript"

---

## package.json dependencies

yarn add @inertiajs/react react@^19 react-dom@^19 @types/react@^19 @types/react-dom@^19 @vitejs/plugin-react typescript
yarn add @chakra-ui/react@^3 @emotion/react framer-motion next-themes react-icons
yarn add -D vite vite-plugin-ruby vite-tsconfig-paths
yarn add -D eslint prettier typescript-eslint @eslint/js globals eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier

Scripts in package.json:
  "check":      "tsc -p tsconfig.app.json && tsc -p tsconfig.node.json"
  "lint":       "eslint app/javascript --ext .ts,.tsx,.js,.jsx"
  "lint:fix":   "eslint app/javascript --ext .ts,.tsx,.js,.jsx --fix"
  "format":     "prettier --check \"app/javascript/**/*.{ts,tsx,js,jsx}\""
  "format:fix": "prettier --write \"app/javascript/**/*.{ts,tsx,js,jsx}\""

---

## tsconfig.app.json

{
  "compilerOptions": {
    "composite": true,
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": { "@/*": ["app/javascript/*"] },
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["app/javascript"]
}

---

## vite.config.ts

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import RubyPlugin from "vite-plugin-ruby";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), RubyPlugin(), tsconfigPaths()],
});

---

## Chakra UI theme

app/javascript/theme/colors.ts — brandColors semantic name map
app/javascript/theme/index.ts — createSystem(defaultConfig, { theme: { tokens: { colors: { primary: { 50–950 } }, fonts: { heading/body: Montserrat } }, semanticTokens: { colors: { primary-subtle/base/bold/hover/active, on-primary-subtle/base/bold } } } })

---

## Chakra Provider + Toaster

app/javascript/components/ui/toaster.tsx — createToaster({ placement: "bottom-end" }) + Toaster component using ChakraToaster inside Portal

app/javascript/hooks/useInertiaToast.ts — useInertiaToasts() reads flash.notice/alert from usePage<InertiaSharedProps>() and fires toaster.create on change

app/javascript/components/ui/provider.tsx — ChakraProvider wrapping ThemeProvider (next-themes, attribute="class") wrapping an InnerProvider that calls useInertiaToasts(). Renders <Toaster /> as a sibling inside ChakraProvider. Exported as Provider with ColorModeProviderProps = ThemeProviderProps.

---

## Inertia entry point

app/javascript/entrypoints/inertia.ts:

import { createInertiaApp } from "@inertiajs/react";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "@/components/ui/provider";

type ResolvedComponent = { default: React.ComponentType };

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob<ResolvedComponent>("../pages/**/*.tsx", { eager: true });
    return pages[`../pages/${name}.tsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      createElement(Provider, { forcedTheme: "light" }, createElement(App, props))
    );
  },
});

---

## Global CSS

app/javascript/entrypoints/application.css:

@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

:root {
  --brand-primary-500: #2f8f6b;
  --brand-primary-700: #1f5e48;
}

---

## Shared TypeScript types

app/javascript/types/inertia.d.ts — declare global { interface Flash, interface InertiaSharedProps extends PageProps }

---

## Rails configuration

config/initializers/oj.rb:
  Oj.optimize_rails

config/initializers/js_routes.rb:
  JsRoutes.setup { |c| c.module_type = "ESM" }

config/initializers/types_from_serializers.rb (development only):
  TypesFromSerializers.config { |c| c.transform_keys = ->(key) { key } }

config/initializers/inertia_rails.rb:
  InertiaRails.configure do |config|
    config.ssr_enabled = ViteRuby.config.ssr_build_enabled
    config.version = ViteRuby.digest
  end

config/application.rb — generators block:
  config.generators do |g|
    g.system_tests    = nil
    g.template_engine = false
    g.helper          = false
    g.assets          = false
    g.stylesheets     = false
  end

config/environments/development.rb — add at end of configure block:
  config.middleware.use(JsRoutes::Middleware)

Rakefile — add after Rails.application.load_tasks:
  task "assets:precompile" => "js:routes"

---

## ApplicationController

class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  inertia_share do
    {
      flash: { notice: flash[:notice], alert: flash[:alert] },
      env: -> { Rails.env.to_s }
    }
  end

  private

  def inertia_errors(model)
    { errors: model.errors.to_hash(true).transform_values(&:to_sentence) }
  end
end

---

## Base serializer

app/serializers/base_serializer.rb:

class BaseSerializer < Oj::Serializer
  include TypesFromSerializers::DSL

  def expand_raw
    options.dig(:expand) || []
  end
end

---

## Spec support

spec/support/webmock.rb:
  require "webmock/rspec"
  WebMock.disable_net_connect!(allow_localhost: true)

spec/support/factory_bot.rb:
  RSpec.configure { |c| c.include FactoryBot::Syntax::Methods }

spec/support/shoulda_matchers.rb:
  Shoulda::Matchers.configure { |c| c.integrate { |w| w.test_framework :rspec; w.library :rails } }

Ensure spec/rails_helper.rb loads all support files:
  Dir[Rails.root.join("spec/support/**/*.rb")].sort.each { |f| require f }

---

## ESLint (eslint.config.js — flat config)

ignores: dist/, node_modules/, app/javascript/generated/, app/javascript/routes*, app/javascript/types/serializers/*
files: app/javascript/**/*.{ts,tsx} — react + react-hooks plugins, browser globals
rules: quotes double, semi always, no-unused-vars with underscore ignore pattern, react/react-in-jsx-scope off, react/prop-types off
last entry: prettier (eslint-config-prettier)

Delete any legacy .eslintrc.js.

---

## .prettierignore

node_modules/, public/, tmp/, log/, app/javascript/routes*, app/javascript/types/serializers/, app/javascript/generated/, .env*

---

## .gitignore — add

/app/javascript/routes.js
/app/javascript/routes.d.ts
/app/javascript/routes/index.js
/app/javascript/routes/index.d.ts

---

## Procfile.dev

web: bin/rails s
vite: bin/vite dev
worker: bin/rails solid_queue:start

---

## bin/lint

#!/usr/bin/env bash
set -e
FIX=""; [[ "$1" == "--fix" ]] && FIX="--fix"
echo "==> ESLint";   [[ -n "$FIX" ]] && yarn lint:fix   || yarn lint
echo "==> Prettier"; [[ -n "$FIX" ]] && yarn format:fix || yarn format
echo "==> RuboCop";  bundle exec rubocop $FIX

chmod +x bin/lint

---

## Final steps

bin/rails db:create db:migrate
bin/rails types_from_serializers:generate
bundle exec rake js:routes:typescript

---

## Verification

1. bin/dev starts 3 processes cleanly (web + vite + worker)
2. Visit the Inertia example page — renders with Chakra UI provider
3. npx tsc -p tsconfig.app.json — no errors
4. bin/lint — passes
5. bundle exec rspec — passes
```
