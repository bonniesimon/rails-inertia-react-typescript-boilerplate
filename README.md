# Rails, Inertia.js, React & TypeScript Boilerplate

This document provides a comprehensive guide to building a modern Rails application from the ground up, featuring a powerful frontend stack with Inertia.js, React, and TypeScript. It also includes configurations for testing with RSpec, code quality with ESLint (v9) and Prettier, and performance enhancements with `oj`.

You can use this repo as a starting point. Or if you want to do it from scratch, then follow this guide.

## Step 1: Initialize the Rails Application

Start by creating a new Rails project. This command sets up a new application with PostgreSQL as the database, Vite for JavaScript and CSS bundling, and skips the default Minitest framework in favor of RSpec.

```bash
rails new your_app_name --database=postgresql --skip-hotwire --skip-jbuilder --skip-system-test --asset-pipeline=vite
cd your_app_name
```

After creation, set up the database:
```bash
bin/setup
```

## Step 2: Configure Core Gems

Modify your `Gemfile` to include the necessary gems for Inertia, RSpec, and other tools.

```ruby
# Gemfile

# ... keep existing gems like rails, pg, puma ...

# Frontend & Inertia
gem "vite_rails"
gem "inertia_rails"

# JSON Serialization
gem "oj"
gem "oj_serializers"
gem "js-routes"
gem "types_from_serializers" # Optional: for generating TS types from serializers

# Testing
group :development, :test do
  gem "rspec-rails"
  gem "factory_bot_rails"
  gem "faker"
end

group :test do
  gem "shoulda-matchers"
end

# ... and any other gems you need, like authentication, etc.
```

Install the new gems:
```bash
bundle install
```
## Step 4: Set Up the Frontend

1.  **Initialize Vite with React and TypeScript:**
    Run the installer and select `react` and `typescript` when prompted.
    ```bash
    bundle exec vite install
    ```

## Step 4: Set Up Testing with RSpec

1.  **Run the RSpec installer:**
    ```bash
    bundle exec rails generate rspec:install
    ```
    *(Note: This might require `mkdir -p app/serializers` if `types_from_serializers` is included)*

2.  **Configure Factory Bot and Shoulda Matchers:**
    Create the directory `spec/support` and add the following files:

    ```ruby
    # spec/support/factory_bot.rb
    RSpec.configure do |config|
      config.include FactoryBot::Syntax::Methods
    end
    ```

    ```ruby
    # spec/support/shoulda_matchers.rb
    Shoulda::Matchers.configure do |config|
      config.integrate do |with|
        with.test_framework :rspec
        with.library :rails
      end
    end
    ```



## Step 6: Configure Inertia.js

1.  **Run the Inertia installer:**
    This creates the required middleware.
    ```bash
    bundle exec rails generate inertia:install
    ```


3.  **Update the frontend entrypoint (`app/frontend/entrypoints/application.tsx`):**
    Initialize the Inertia app.
    ```typescript
    import './application.css';
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { createInertiaApp } from '@inertiajs/react';

    createInertiaApp({
      resolve: (name) => {
        const pages = import.meta.glob('../pages/**/*.tsx', { eager: true });
        return pages[`../pages/${name}.tsx`];
      },
      setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
      },
    });
    ```
    And create the pages directory: `mkdir -p app/frontend/pages`.

## Step 7: Final Configurations

1.  **Add `js-routes`**:
    Create `config/initializers/js_routes.rb` and configure it to output to your frontend directory.
    ```ruby
    JsRoutes.setup do |config|
      config.file = 'app/frontend/generated/routes.js'
      config.camel_case = true
    end
    ```
    Then run `bundle exec rails g js:routes`.

2.  **Add `oj`**:
    Create `config/initializers/oj.rb` to enable faster JSON rendering.
    ```ruby
    # frozen_string_literal: true
    Oj.optimize_rails
    ```

3.  **ESLint and Prettier**:
    Create `eslint.config.js` for the new "flat config" format. Refer to the official ESLint documentation or use the file from this boilerplate. Create a `.prettierrc` file to define your formatting rules. Finally, add `lint` and `format` scripts to your `package.json`.
    ```bash
    yarn add -D eslint prettier typescript-eslint @eslint/js globals eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier
    ```
---
