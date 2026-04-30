/**
 * @fileoverview Componente ToolCard
 * Genera tarjetas de herramientas de forma dinámica
 */

export class ToolCard {
  constructor(tool) {
    this.tool = tool;
  }

  render() {
    const featuredClass = this.tool.featured ? 'featured' : '';
    const categoryIcon = this.getCategoryIcon();

    return `
      <div class="tool-card ${featuredClass}" data-category="${this.tool.category}" data-id="${this.tool.id}">
        <div class="tool-header">
          <div class="tool-icon">${this.tool.icon}</div>
          ${this.tool.featured ? '<span class="featured-badge">⭐ Destacado</span>' : ''}
        </div>
        <div class="tool-content">
          <h3 class="tool-name">${this.tool.name}</h3>
          <p class="tool-description">${this.tool.description}</p>
          <div class="tool-meta">
            <span class="tool-category">${categoryIcon} ${this.getCategoryName()}</span>
          </div>
        </div>
        <div class="tool-footer">
          <a href="${this.tool.url}" class="btn btn-primary tool-btn" target="_blank">
            Acceder
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    `;
  }

  getCategoryIcon() {
    const categoryIcons = {
      'fitness': '💪',
      'development': '💻',
      'it': '💻',
      'productivity': '📈'
    };
    return categoryIcons[this.tool.category] || '🔧';
  }

  getCategoryName() {
    const categoryNames = {
      'fitness': 'Fitness',
      'development': 'Desarrollo',
      'it': 'IT',
      'productivity': 'Productividad'
    };
    return categoryNames[this.tool.category] || 'General';
  }
}