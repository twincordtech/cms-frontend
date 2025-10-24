# CMS Application Frontend

## Overview
This is the **frontend** for the CMS Application, built with React and modern UI/UX best practices. It provides a rich dashboard for managing all aspects of your content-driven website or application, including blogs, pages, components, layouts, media, newsletters, users, and more.

---

## Features & Functionality

### 1. Dashboard
- **Overview of Key Stats:** Instantly see metrics for leads, blogs, newsletters, users, and more, helping admins and content creators monitor site health and engagement.
- **Quick Actions:** Access shortcuts to create new content, manage users, or view recent activity, streamlining daily workflows.
- **Recent Activity Feed:** Track the latest changes, submissions, and user actions for transparency and auditing.

### 2. Blog Management
- **Create, Edit, and Preview Blogs:** Use a rich text editor with formatting, image embedding, and live preview. See exactly how your blog will look before publishing.
- **Author Management:** Assign existing authors or add new ones directly from the blog form. Manage author roles and display author info on published blogs.
- **SEO Fields:** Add meta titles, descriptions, and slugs to optimize blogs for search engines.
- **Status Control:** Save blogs as drafts for later editing or publish instantly. Only published blogs are visible to the public.
- **Featured Images:** Upload, preview, and manage blog images for visual appeal and branding.
- **Blog Listing & Search:** View, filter, and search all blogs from a central dashboard, with options to edit, duplicate, or delete.

### 3. Page & Content Management
- **Dynamic Page Builder:** Create and edit pages by assembling modular components (banners, about sections, testimonials, features, etc.) for flexible, content-rich layouts—no coding required.
- **Flexible Layouts:** Choose from pre-built and custom components to design unique pages for landing, blog, contact, and more.
- **Content Editing:** Update text, images, and other fields for each component directly in the UI.
- **SEO Optimization:** Add meta titles, descriptions, and slugs for each page to improve search engine visibility.
- **Content Preview:** Instantly preview your page as it will appear to end users before publishing.
- **Draft & Publish Workflow:** Save pages as drafts for review or editing, and publish when ready.
- **Page Management:** View, search, and organize all your pages from a central dashboard, with options to edit, duplicate, or delete.
- **Reusable Content:** Use the same components across multiple pages for consistent branding and faster content creation.

### 4. Component Builder
- **Reusable UI Components:** Build and manage custom components (e.g., cards, banners, testimonials) for use across pages and blogs.
- **Field Customization:** Add fields of various types (text, image, select, etc.) and group fields for complex data structures.
- **Repeatable Groups:** Create repeatable field groups for lists, galleries, or other multi-item content.
- **Component Library:** Maintain a library of components for rapid page and content assembly.

### 5. Media Library
- **Upload & Manage Files:** Drag-and-drop uploads, preview images, and organize files in folders for easy access.
- **Image Selection:** Select and insert images into blogs, pages, and components with a single click.
- **File Deletion & Editing:** Rename, delete, and update media files as needed.
- **Media Search & Filter:** Quickly find media assets using search and filtering tools.

### 6. Newsletter Management
- **Create & Schedule Newsletters:** Compose, schedule, and send newsletters to subscribers with a rich editor.
- **Subscriber Management:** Add, edit, and remove subscribers. Import/export subscriber lists.
- **Send Status & History:** Track sent, scheduled, and draft newsletters, with delivery stats and logs.
- **Recurring Schedules:** Set up weekly or monthly recurring newsletters for automated campaigns.
- **Newsletter Preview:** Preview newsletters before sending to ensure formatting and content accuracy.

### 7. User & Profile Management
- **Role-Based Access:** Admin and user roles with different permissions for secure, collaborative workflows.
- **Profile Editing:** Users can update their personal info, password, and preferences.
- **User Registration:** Admins can add new users, assign roles, and manage existing users.


### 8. Inquiry & Lead Management
- **Leads Table:** View, filter, and manage incoming leads with detailed info and status tracking.
- **Inquiry Tracking:** Track inquiries, schedule meetings, and update statuses for better customer engagement.
- **Activity History:** See a log of all actions for auditing, compliance, and troubleshooting.
- **Lead/Inquiry Export:** Export leads and inquiries for use in CRM or marketing tools.

### 9. Notifications
- **Real-Time Alerts:** Get notified of new leads, content updates, and system events as they happen.
- **Notification Center:** View, mark as read, or delete notifications. Stay on top of important updates.
- **Customizable Notifications:** Choose which events trigger notifications for a personalized experience.

### 10. Modern UI/UX
- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile for all users.
- **Accessibility:** Keyboard navigation, screen reader support, and high-contrast modes for inclusivity.
- **Animated Interactions:** Smooth transitions, feedback, and modals for a delightful user experience.
- **Dark Mode:** Optional dark theme for comfortable viewing in any environment.

### 11. Security & Best Practices
- **Authentication:** Secure login, registration, and password reset flows with JWT and HTTP-only cookies.
- **Input Validation:** All forms are validated for safe and correct data entry, preventing bad data and attacks.
- **Error Handling:** User-friendly error messages, error boundaries, and logging for robust operation.
- **Audit Trails:** Track all significant actions for compliance and debugging.

---

## Tech Stack
- **React** (with Hooks)
- **Tailwind CSS** (utility-first styling)
- **Ant Design** (UI components)
- **React Router** (routing)
- **React Icons** (iconography)
- **React Quill** (rich text editor)
- **Framer Motion** (animations)
- **Day.js** (date/time formatting)
- **React Toastify** (notifications)
- **Lodash** (utility functions)

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd cms-application/client
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## Available Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code with ESLint
- `npm run format` — Format code with Prettier

---

## Complete Folder Structure

```
client/
  ├── public/                       # Static assets (favicon, etc.)
  ├── src/
  │   ├── api.js                    # API base config and interceptors
  │   ├── App.jsx                   # Main app component and routes
  │   ├── config.js                 # Frontend config (API URLs, etc.)
  │   ├── constants/
  │   │   └── fieldTypes            # Field type definitions
  │   ├── contexts/
  │   │   └── AuthContext.jsx       # Authentication context provider
  │   ├── hooks/
  │   │   ├── useAutoSave.js        # Auto-save hook for forms
  │   │   ├── useLayoutAutoSave.js  # Auto-save for layouts
  │   │   └── usePageLeaveConfirmation.js # Warn on unsaved changes
  │   ├── components/
  │   │   ├── elements/             # Basic UI elements (Button, Card, Input, etc.)
  │   │   ├── common/               # Common utilities (ErrorBoundary, etc.)
  │   │   ├── dynamic/
  │   │   │   ├── ComponentEditor.jsx
  │   │   │   ├── ComponentModal.jsx
  │   │   │   ├── components/       # Dynamic section components (About, Banner, etc.)
  │   │   │   ├── formBuilder/      # Form builder subcomponents
  │   │   │   ├── FormBuilder.jsx
  │   │   │   ├── FormPreview.jsx
  │   │   │   ├── FormRenderer.jsx
  │   │   │   └── PreviewModal.jsx
  │   │   ├── global/               # Global/shared components (Sidebar, Header, etc.)
  │   │   ├── inquiries/            # Inquiry management modals and tables
  │   │   ├── layout/               # Layout-related components (Navbar, Layout, etc.)
  │   │   ├── layouts/              # Layout forms and selectors
  │   │   ├── leads/                # Lead management modals and tables
  │   │   ├── media/                # Media management modals and tables
  │   │   ├── newsletter/           # Newsletter management modals and tables
  │   │   ├── pages/                # Page management modals and fields
  │   │   ├── profile/              # User profile sections
  │   │   ├── routes/               # Route guards (AdminRoute, PrivateRoute)
  │   │   ├── sections/             # Section management components
  │   │   ├── skeletons/            # Loading skeletons
  │   │   ├── tables/               # Table components (if any)
  │   │   ├── ui/                   # UI modals, spinners, etc.
  │   ├── pages/
  │   │   ├── auth/
  │   │   │   ├── ForgotPassword.jsx
  │   │   │   ├── Login.jsx
  │   │   │   ├── Register.jsx
  │   │   │   ├── ResetPassword.jsx
  │   │   │   └── SetPassword.jsx
  │   │   ├── dashboard/
  │   │   │   ├── ActivityHistoryPage.jsx
  │   │   │   ├── ApiPlayground.jsx
  │   │   │   ├── BlogDashboard.jsx
  │   │   │   ├── BlogForm.jsx
  │   │   │   ├── ComponentBuilder.jsx
  │   │   │   ├── Components.jsx
  │   │   │   ├── ContentDashboard.jsx
  │   │   │   ├── ContentForm.jsx
  │   │   │   ├── CreateSection.jsx
  │   │   │   ├── Dashboard.jsx
  │   │   │   ├── DashboardHome.jsx
  │   │   │   ├── DynamicComponents.jsx
  │   │   │   ├── FormBuilderPage.jsx
  │   │   │   ├── FormRenderPage.jsx
  │   │   │   ├── forms/            # Dashboard forms
  │   │   │   ├── InquiriesManagement.jsx
  │   │   │   ├── LayoutComponentView.jsx
  │   │   │   ├── LayoutDashboard.jsx
  │   │   │   ├── LeadsManagement.jsx
  │   │   │   ├── MediaLibrary.jsx
  │   │   │   ├── NewsletterDashboard.jsx
  │   │   │   ├── PageForm.jsx
  │   │   │   ├── PagesList.jsx
  │   │   │   ├── Profile.jsx
  │   │   │   ├── SectionEditor.jsx
  │   │   │   ├── SectionForm.jsx
  │   │   │   ├── SectionsList.jsx
  │   │   │   ├── UserRegistration.jsx
  │   │   │   └── Users.jsx
  │   │   ├── EditPage.jsx
  │   │   ├── Home.jsx
  │   │   ├── HomePage.jsx
  │   │   ├── NotFound.jsx
  │   │   ├── PageContent.jsx
  │   │   ├── PublicPage.jsx
  │   │   └── ...                   # Other top-level pages
  │   ├── services/
  │   │   ├── api.js
  │   │   ├── auth.js
  │   │   └── ...                   # Other API service modules
  │   ├── utils/
  │   │   ├── copyright.js
  │   │   ├── formUtils.js
  │   │   ├── layoutHelpers.js
  │   │   ├── sampleDataHelpers.js
  │   │   └── ...                   # Other utility/helper functions
  │   ├── index.css                 # Global styles (Tailwind, custom)
  │   └── main.jsx                  # App entry point
  ├── package.json                  # Project metadata & scripts
  ├── postcss.config.js             # PostCSS config
  ├── tailwind.config.js            # Tailwind CSS config
  └── vite.config.js                # Vite build config
```

**Key Folder Descriptions:**
- `components/`: All reusable UI and feature components, organized by domain/feature.
- `pages/`: Top-level pages and dashboard subpages.
- `services/`: API service modules for backend communication.
- `contexts/`: React context providers for global state (e.g., Auth).
- `hooks/`: Custom React hooks for logic reuse.
- `utils/`: Utility/helper functions for formatting, validation, etc.
- `constants/`: App-wide constants and enums.

---

## Customization
- **Theming**: Modify `tailwind.config.js` for custom colors, fonts, etc.
- **Branding**: Update logos and app name in `src/components/layout/Sidebar.jsx` and `Navbar.jsx`.
- **API Endpoints**: Configure API base URLs in `src/services/api.js`.

---

## Contribution Guidelines
- Follow the existing code style (ESLint + Prettier enforced)
- Use clear, descriptive commit messages
- Add comments for complex logic
- Remove unused code and logs before submitting PRs
- Write unit/integration tests for new features
- Open issues/PRs for bugs and feature requests

---

## Author
**Tech4biz Solutions**

## License
Copyright © Tech4biz Solutions Private. All rights reserved.

--- 