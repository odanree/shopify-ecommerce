# Custom Shopify Theme

A modern, responsive Shopify theme built from scratch with clean code and best practices.

## Features

- 📱 Fully responsive design
- 🎨 Customizable colors and typography via Theme Settings
- 🛒 Product pages with variant selection
- 📦 Collection pages with filtering
- 🛍️ Shopping cart functionality
- ⚡ Fast loading and optimized performance
- ♿ Accessibility-focused
- 🌐 Multi-language support ready

## Structure

```
shopify-theme/
├── assets/          # CSS, JS, images, fonts
├── config/          # Theme settings schema and data
├── layout/          # Theme layout files (theme.liquid)
├── locales/         # Translation files
├── sections/        # Reusable sections
├── snippets/        # Reusable code snippets
└── templates/       # Page templates (JSON)
```

## Getting Started

### Prerequisites

- [Shopify CLI](https://shopify.dev/themes/tools/cli) installed
- A Shopify Partner account or Shopify store

### Installation

1. Install Shopify CLI:
```bash
npm install -g @shopify/cli @shopify/theme
```

2. Navigate to the theme directory:
```bash
cd shopify-theme
```

3. Connect to your Shopify store:
```bash
shopify theme dev --store your-store.myshopify.com
```

4. The theme will be uploaded and you'll get a preview URL to test

### Development

To start developing with live reload:

```bash
shopify theme dev
```

This will:
- Upload your theme to a development store
- Watch for file changes
- Provide a preview URL
- Hot reload on save

### Deployment

To push your theme to your Shopify store:

```bash
# Push to unpublished theme
shopify theme push

# Push and publish
shopify theme push --publish
```

## Customization

### Colors & Typography

Customize colors and fonts through the Shopify admin:
1. Go to Online Store > Themes
2. Click "Customize" on your theme
3. Navigate to Theme Settings
4. Adjust colors, fonts, and layout options

### Adding New Sections

Create new section files in the `sections/` directory:

```liquid
{% schema %}
{
  "name": "My Custom Section",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Section Title"
    }
  ]
}
{% endschema %}
```

### Custom CSS

Add custom styles to `assets/base.css` or create new CSS files and include them in `layout/theme.liquid`.

## File Structure Explained

- **layout/theme.liquid**: Main template wrapper for all pages
- **templates/**: JSON templates that define page structure using sections
- **sections/**: Reusable, customizable sections (header, footer, product-grid, etc.)
- **snippets/**: Small reusable code chunks (product-card, meta-tags, etc.)
- **assets/**: Static files (CSS, JS, images)
- **config/settings_schema.json**: Theme customization options
- **config/settings_data.json**: Current theme settings values
- **locales/**: Translation strings for internationalization

## Best Practices

1. **Use Liquid filters** for image optimization: `{{ image | image_url: width: 500 }}`
2. **Lazy load images** for better performance
3. **Use sections** for customizable content blocks
4. **Test on multiple devices** and browsers
5. **Follow Shopify theme requirements** for Theme Store approval

## Resources

- [Shopify Theme Documentation](https://shopify.dev/themes)
- [Liquid Reference](https://shopify.dev/api/liquid)
- [Theme Architecture](https://shopify.dev/themes/architecture)
- [Shopify CLI](https://shopify.dev/themes/tools/cli)

## Support

For issues or questions, please refer to [Shopify Community Forums](https://community.shopify.com/) or [Shopify Help Center](https://help.shopify.com/).

## License

This theme is open source and available under the MIT License.
