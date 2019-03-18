# Nuxt admin

Admin module for nuxt using [Netlify CMS](https://www.netlifycms.org).

## Install

With yarn:

```bash
yarn add @juliendargelos/nuxt-admin
```

With npm:

```bash
npm install @juliendargelos/nuxt-admin --save
```

## Usage

Nuxt admin makes your static nuxt project able to edit data files through [Netlify CMS](https://www.netlifycms.org).

I recommend using the [nuxt-data](https://github.com/juliendargelos/nuxt-data) package to manage yaml data files.

Also see my [nuxt-starter](https://github.com/juliendargelos/nuxt-starter) which is an example using nuxt-admin and nuxt-data.

> Read the [Netlify CMS documentation](https://www.netlifycms.org/docs/) for more informations.

#### Add the module in your nuxt config:

```shell
export default {
   modules: [
    ['@juliendargelos/nuxt-admin', {
      title: 'My website - Admin',
      lazy: !process.env.ADMIN
    }]
   ]
}
```

**Options:**

- `title` (default: `'Admin'`): Specify the title of the admin page.
- `lazy` (default: `false`): If set to `true`, the admin page will not be built if it has already been.

#### Create the admin folder

Create the following files at the root of your nuxt project:
  - `admin/index.js`: Entry of your admin page.
  - `admin/config.yml`: [Netlify CMS configuration file](https://www.netlifycms.org/docs/configuration-options/).

#### Import and configure admin

You have to import nuxt admin from `pages/index.vue` and `admin/index.js`:

```javascript
// pages/index.vue

<script>
import 'admin' // required
</script>
```

```javascript
// admin/index.js

import 'admin' // Required
import '~/assets/admin.sass' // You can import a custom stylesheet
import cms from 'netlify-cms' // Required
import Preview from 'admin/preview'
import Home from '~/pages/index'
import Article from '~/components/article'

// Register your stylesheets
cms.registerPreviewStyle(document.querySelector('link[rel="stylesheet"]').href)

// Register your previews
cms.registerPreviewTemplate('home', Preview.for(Home))
cms.registerPreviewTemplate('article', Preview.for(Article))
```

You can use any of your vue component as a [Netlify CMS preview](https://www.netlifycms.org/docs/customization/) with `Preview.for` which creates a bridge from react to vue.

Your vue component will recieve data from admin form as props (see [Netlify CMS widgets](https://www.netlifycms.org/docs/widgets/)):

```yaml
# static/admin/config.yml

collections:
  - label: Articles
    label_singular: Article
    name: article
    folder: data/articles/
    extension: yml
    create: true
    fields:
      - {label: Title, name: title, widget: string}
      - {label: Image, name: image, widget: image}
      - {label: Content, name: content, widget: markdown}
```

`components/article.vue`:
```html
<template>
  <div>
    <h2>{{title}}</h2>
    <img :src="image">
    <Markdown :source="content"/>
  </div>
</template>

<script>
  import Markdown from '~/components/markdown'

  export default {
    props: ['title', 'content', 'image'],

    components: {
      Markdown // Assuming that this component translates markdown into html
    }
  }
</script>
```

#### Build

The admin page is generated in a separate webpack process which output to `static/admin`. So the admin page is published as a static file, independently of vue and vue router.

The admin page is only generated when `NODE_ENV` is equal to `'production'`. So make sure to run `nuxt build` or `nuxt generate` before running `nuxt` if you want to access admin from dev server.

You might want to push the built admin to your repository so Netlify deploys will be much faster. Also use the `lazy` module option to prevent unnecessary admin build when deploying to Netlify (especially for deploys triggered by Netlify CMS):

```javascript
// nuxt.config.js

export default {
  modules: [
    ['@juliendargelos/nuxt-admin', {
      lazy: !!process.env.CONTEXT // The CONTEXT environment variable is set by Netlify
    }]
  ]
}
```
