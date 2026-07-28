---
order: 4
name: Commerce Hub
status: Active Development
problem: >-
  Many retail businesses manage online sales using disconnected tools that separate storefront management from operational workflows, creating unnecessary manual work.
solution: >-
  Built a commerce platform centered around an operational dashboard that consolidates store administration, product management, customer management, order processing, monitoring, and business insights.
highlights:
  - Operations dashboard
  - Order management
  - WhatsApp ordering
  - Analytics
  - Mobile-first interface
  - Arabic-first experience
stack:
  - React
  - Vite
  - REST APIs
  - Responsive Architecture
  - Dashboard Design System
  - WhatsApp Integration

# Captures of the running admin panel. Ordered deliberately: the content
# editor leads because its live-preview panel is the only frame that shows
# the owner changing the storefront and seeing the result, which is the
# platform's actual argument.
#
# Every account identifier and contact number in these frames was redacted
# destructively before the files were written — the pixels are overwritten,
# not covered. width/height are the processed files' real dimensions and are
# what keep the Gallery from shifting layout as the images decode.
gallery:
  - src: "/screenshots/commerce-hub-content.png"
    alt: "Store content editor with a live preview panel alongside the form"
    caption: "The owner edits store copy and sees the result immediately — no deploy, no developer."
    width: 917
    height: 639
  - src: "/screenshots/commerce-hub-categories.png"
    alt: "Category management showing seven categories with product counts"
    caption: "Categories are reordered by drag; changes save without a confirm step."
    width: 1358
    height: 634
  - src: "/screenshots/commerce-hub-products.png"
    alt: "Product catalogue listing 205 items with pricing and discounts"
    caption: "205 products, priced and discounted by the owner directly."
    width: 1359
    height: 601

studyPending: false
study:
  oneLine: >-
    Designed a commerce platform with an integrated operations dashboard, allowing retailers to manage products, customers, orders, and store operations from a unified control center.
  sector: Retail Commerce
  size: Single-business commerce platform
  role: Designed and Built
  period: "2026"

  context: >-
    The project was built to demonstrate how retail operations can be managed through a single operational interface rather than multiple disconnected administration tools. Instead of treating the dashboard as a secondary management panel, the platform positions it as the primary workspace for daily business operations.
  problem: >-
    Many retail businesses manage online sales using disconnected tools that separate storefront management from operational workflows, creating unnecessary manual work.
  constraints: >-
    The platform had to remain responsive across desktop and mobile devices. Operational workflows needed to stay simple for daily business use. The interface had to support future expansion without redesigning the navigation structure. Store management functions needed to remain centralized. Performance had to remain acceptable while presenting large operational datasets. The architecture needed to separate presentation from business logic for long-term maintainability.
  decision: >-
    The defining architectural decision was to design the dashboard around operational workflows instead of individual application modules. Every feature was organized around how the business operates rather than how the software is structured.

  spread:
    exists: >-
      Unified operations dashboard. Product management. Category management. Order management. Customer management. Business analytics. Monitoring interface. Responsive administration experience.
    notBuilt: >-
      Marketplace management. Multi-store synchronization. ERP replacement. Advanced warehouse automation. Enterprise resource planning modules. The project deliberately focuses on operational simplicity instead of becoming a full enterprise commerce suite.
    tradeoff: >-
      Prioritizing a focused operational dashboard limits enterprise-level functionality, but produces a cleaner interface, faster workflows, and a system that remains easier to maintain and extend.

  evidence:
    type: combination
    shows: >-
      This evidence demonstrates how retail administration is centralized into a single operational dashboard supporting daily business management.
    caption: >-
      Dashboard interface, operational workflows, administration screens, and retail management architecture.
    callouts:
      - Operations dashboard
      - Order management
      - Product management
      - Customer management
      - Analytics
      - Responsive interface

  technical: >-
    The dashboard was designed as the operational center of the business rather than a simple administration panel, bringing daily retail management into a single interface.

  authoring:
    disclosure: >-
      No client information is included. Any demonstration data, customer information, product names, or business identifiers should remain anonymized before publication.
    assetsRequired:
      - asset: Dashboard overview screenshot
        state: have
      - asset: Order management screenshots
        state: have
      - asset: System architecture diagram
        state: must-make
      - asset: User flow diagram
        state: must-make
    claimLedger:
      - claim: The platform centralizes retail operations into a unified dashboard.
        restsOn: Dashboard implementation.
      - claim: Products, customers, and orders are managed from one interface.
        restsOn: Application functionality.
      - claim: The platform is designed around operational workflows.
        restsOn: Interface architecture.
      - claim: The dashboard is responsive across devices.
        restsOn: Frontend implementation.
      - claim: WhatsApp ordering is integrated into the operational workflow.
        restsOn: Platform functionality.
      - claim: The architecture separates presentation from operational logic.
        restsOn: Frontend design.
      - claim: The project is designed and built by the author.
        restsOn: Source repository and engineering documentation.
      - claim: The platform serves as a commerce operations center rather than a simple administration panel.
        restsOn: System architecture and interface design.
---
