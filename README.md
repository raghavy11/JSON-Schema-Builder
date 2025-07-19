# 🛠️ JSON Schema Builder

A modern, interactive React component for building JSON schemas with a beautiful UI and smooth animations. Create complex nested JSON structures with an intuitive drag-and-drop interface.

## ✨ Features

- **🎨 Beautiful UI**: Modern gradient backgrounds with smooth animations
- **🔄 Real-time Preview**: Live JSON schema generation as you build
- **🌳 Nested Fields**: Support for unlimited nesting levels
- **🎭 Interactive Animations**: Hover effects, transitions, and micro-interactions
- **📱 Responsive Design**: Works perfectly on all screen sizes
- **🎯 Type Safety**: Built with modern React patterns and best practices
- **⚡ Performance Optimized**: Efficient re-rendering and state management
- **🎪 Visual Feedback**: Color-coded field types and validation states

## 🚀 Demo

\`\`\`bash

# Clone the repository

git clone https://github.com/yourusername/json-schema-builder.git

# Navigate to project directory

cd json-schema-builder

# Install dependencies

npm install

# Start development server

npm run dev
\`\`\`

Visit \`http://localhost:3000\` to see the component in action!

## 📦 Installation

### Prerequisites

- Node.js 16+
- React 18+
- Next.js 13+ (if using App Router)

### Quick Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install antd react react-dom
   \`\`\`

2. **Copy the component files:**
   \`\`\`
   src/
   ├── components/
   │ ├── schema-builder.jsx
   │ └── schema-builder.module.css
   └── utils/
   └── convertToJSONSchema.js
   \`\`\`

## 🏗️ Component Structure

### File Organization

\`\`\`
schema-builder/
├── schema-builder.jsx # Main React component
├── schema-builder.module.css # Styled CSS modules
└── utils/
└── convertToJSONSchema.js # Schema conversion utility
\`\`\`

### Key Components

- **SchemaBuilder**: Main container component
- **FieldRow**: Individual field component with nesting support
- **Field Types**: String, Number, Nested object support
- **JSON Preview**: Real-time schema preview tab

## 👥 Authors

- **Raghav Yadav** – _Frontend Development & JSON Schema Logic_ – [@raghavydv](https://github.com/raghavydv)

## 🙏 Acknowledgments

- **Ant Design** - For the beautiful UI components
- **React Team** - For the amazing framework
- **CSS Modules** - For scoped styling solution
- **Community Contributors** - For feedback and improvements

## 🌟 Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---

**Made with ❤️ by [Ragghav Yadav](https://github.com/raghavyadav)**

_Happy Schema Building! 🛠️✨_
