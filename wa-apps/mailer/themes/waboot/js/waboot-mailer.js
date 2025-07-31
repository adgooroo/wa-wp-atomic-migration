/**
 * Waboot Mailer Theme - Main JavaScript File
 * Extends parent theme functionality with mailer-specific features
 */

(function() {
    'use strict';
    
    // Mailer Theme Class
    class WabootMailer {
        constructor() {
            this.init();
        }
        
        init() {
            this.setupEventListeners();
            this.initializeComponents();
            this.setupNotifications();
            this.setupFormValidation();
            this.setupEmailPreview();
            this.setupCampaignBuilder();
        }
        
        setupEventListeners() {
            // Global event listeners for mailer functionality
            document.addEventListener('DOMContentLoaded', () => {
                this.handleEmailValidation();
                this.handleCampaignActions();
                this.handleSubscriberActions();
                this.handleTemplateActions();
                this.handleStatisticsRefresh();
            });
            
            // Handle window resize for responsive components
            window.addEventListener('resize', this.debounce(() => {
                this.handleResponsiveLayout();
            }, 250));
            
            // Handle beforeunload for unsaved changes
            window.addEventListener('beforeunload', (e) => {
                if (this.hasUnsavedChanges()) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            });
        }
        
        initializeComponents() {
            // Initialize Alpine.js components if not already done
            if (typeof Alpine !== 'undefined') {
                this.initializeAlpineComponents();
            }
            
            // Initialize tooltips
            this.initializeTooltips();
            
            // Initialize modals
            this.initializeModals();
            
            // Initialize dropdowns
            this.initializeDropdowns();
        }
        
        setupNotifications() {
            // Create notification container if it doesn't exist
            if (!document.getElementById('waboot-mailer-notifications')) {
                const notificationContainer = document.createElement('div');
                notificationContainer.id = 'waboot-mailer-notifications';
                notificationContainer.className = 'waboot-mailer__notifications';
                document.body.appendChild(notificationContainer);
            }
        }
        
        setupFormValidation() {
            // Setup form validation for mailer forms
            const forms = document.querySelectorAll('.waboot-mailer__form');
            forms.forEach(form => {
                this.setupFormValidationForElement(form);
            });
        }
        
        setupEmailPreview() {
            // Setup email preview functionality
            const previewButtons = document.querySelectorAll('.waboot-mailer__preview-btn');
            previewButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showEmailPreview(button.dataset.campaignId);
                });
            });
        }
        
        setupCampaignBuilder() {
            // Setup campaign builder functionality
            const builderContainer = document.querySelector('.waboot-mailer__email-builder');
            if (builderContainer) {
                this.initializeCampaignBuilder(builderContainer);
            }
        }
        
        handleEmailValidation() {
            // Email validation for subscribe forms
            const emailInputs = document.querySelectorAll('input[type="email"]');
            emailInputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateEmail(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearEmailValidation(input);
                });
            });
        }
        
        handleCampaignActions() {
            // Campaign action buttons
            const campaignActions = document.querySelectorAll('[data-action="campaign"]');
            campaignActions.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const action = button.dataset.campaignAction;
                    const campaignId = button.dataset.campaignId;
                    
                    switch (action) {
                        case 'edit':
                            this.editCampaign(campaignId);
                            break;
                        case 'delete':
                            this.deleteCampaign(campaignId);
                            break;
                        case 'send':
                            this.sendCampaign(campaignId);
                            break;
                        case 'duplicate':
                            this.duplicateCampaign(campaignId);
                            break;
                        case 'preview':
                            this.previewCampaign(campaignId);
                            break;
                    }
                });
            });
        }
        
        handleSubscriberActions() {
            // Subscriber action buttons
            const subscriberActions = document.querySelectorAll('[data-action="subscriber"]');
            subscriberActions.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const action = button.dataset.subscriberAction;
                    const subscriberId = button.dataset.subscriberId;
                    
                    switch (action) {
                        case 'edit':
                            this.editSubscriber(subscriberId);
                            break;
                        case 'delete':
                            this.deleteSubscriber(subscriberId);
                            break;
                        case 'export':
                            this.exportSubscriber(subscriberId);
                            break;
                    }
                });
            });
        }
        
        handleTemplateActions() {
            // Template action buttons
            const templateActions = document.querySelectorAll('[data-action="template"]');
            templateActions.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const action = button.dataset.templateAction;
                    const templateId = button.dataset.templateId;
                    
                    switch (action) {
                        case 'use':
                            this.useTemplate(templateId);
                            break;
                        case 'preview':
                            this.previewTemplate(templateId);
                            break;
                        case 'duplicate':
                            this.duplicateTemplate(templateId);
                            break;
                    }
                });
            });
        }
        
        handleStatisticsRefresh() {
            // Auto-refresh statistics
            const statsContainer = document.querySelector('.waboot-mailer__statistics');
            if (statsContainer && statsContainer.dataset.autoRefresh === 'true') {
                setInterval(() => {
                    this.refreshStatistics();
                }, 30000); // Refresh every 30 seconds
            }
        }
        
        handleResponsiveLayout() {
            // Handle responsive layout changes
            const emailBuilder = document.querySelector('.waboot-mailer__email-builder');
            if (emailBuilder) {
                const isMobile = window.innerWidth < 768;
                emailBuilder.classList.toggle('waboot-mailer__email-builder--mobile', isMobile);
            }
        }
        
        // Email validation
        validateEmail(input) {
            const email = input.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.showFieldError(input, 'Please enter a valid email address');
                return false;
            }
            
            this.clearFieldError(input);
            return true;
        }
        
        clearEmailValidation(input) {
            this.clearFieldError(input);
        }
        
        // Form validation
        setupFormValidationForElement(form) {
            const submitButton = form.querySelector('button[type="submit"]');
            const requiredFields = form.querySelectorAll('[required]');
            
            if (submitButton) {
                submitButton.addEventListener('click', (e) => {
                    if (!this.validateForm(form)) {
                        e.preventDefault();
                    }
                });
            }
            
            requiredFields.forEach(field => {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
            });
        }
        
        validateForm(form) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }
        
        validateField(field) {
            const value = field.value.trim();
            
            if (field.hasAttribute('required') && !value) {
                this.showFieldError(field, 'This field is required');
                return false;
            }
            
            if (field.type === 'email' && value) {
                return this.validateEmail(field);
            }
            
            this.clearFieldError(field);
            return true;
        }
        
        showFieldError(field, message) {
            this.clearFieldError(field);
            
            field.classList.add('waboot-mailer__input--error');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'waboot-mailer__field-error';
            errorElement.textContent = message;
            
            field.parentNode.appendChild(errorElement);
        }
        
        clearFieldError(field) {
            field.classList.remove('waboot-mailer__input--error');
            
            const errorElement = field.parentNode.querySelector('.waboot-mailer__field-error');
            if (errorElement) {
                errorElement.remove();
            }
        }
        
        // Campaign actions
        async editCampaign(campaignId) {
            try {
                window.location.href = `/mailer/campaigns/${campaignId}/edit/`;
            } catch (error) {
                this.showNotification('Failed to open campaign editor', 'error');
            }
        }
        
        async deleteCampaign(campaignId) {
            if (confirm('Are you sure you want to delete this campaign?')) {
                try {
                    const response = await fetch(`/mailer/campaigns/${campaignId}/delete/`, {
                        method: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': this.getCsrfToken()
                        }
                    });
                    
                    const result = await response.json();
                    
                    if (result.status === 'ok') {
                        this.showNotification('Campaign deleted successfully', 'success');
                        this.reloadPage();
                    } else {
                        throw new Error(result.errors || 'Failed to delete campaign');
                    }
                } catch (error) {
                    this.showNotification('Failed to delete campaign', 'error');
                }
            }
        }
        
        async sendCampaign(campaignId) {
            if (confirm('Are you sure you want to send this campaign?')) {
                try {
                    const response = await fetch(`/mailer/campaigns/${campaignId}/send/`, {
                        method: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': this.getCsrfToken()
                        }
                    });
                    
                    const result = await response.json();
                    
                    if (result.status === 'ok') {
                        this.showNotification('Campaign sent successfully', 'success');
                        this.reloadPage();
                    } else {
                        throw new Error(result.errors || 'Failed to send campaign');
                    }
                } catch (error) {
                    this.showNotification('Failed to send campaign', 'error');
                }
            }
        }
        
        async duplicateCampaign(campaignId) {
            try {
                const response = await fetch(`/mailer/campaigns/${campaignId}/duplicate/`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': this.getCsrfToken()
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.showNotification('Campaign duplicated successfully', 'success');
                    this.reloadPage();
                } else {
                    throw new Error(result.errors || 'Failed to duplicate campaign');
                }
            } catch (error) {
                this.showNotification('Failed to duplicate campaign', 'error');
            }
        }
        
        async previewCampaign(campaignId) {
            try {
                const response = await fetch(`/mailer/campaigns/${campaignId}/preview/`, {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.showEmailPreviewModal(result.data.html, result.data.subject);
                } else {
                    throw new Error(result.errors || 'Failed to load preview');
                }
            } catch (error) {
                this.showNotification('Failed to load preview', 'error');
            }
        }
        
        // Subscriber actions
        async editSubscriber(subscriberId) {
            try {
                window.location.href = `/mailer/subscribers/${subscriberId}/edit/`;
            } catch (error) {
                this.showNotification('Failed to open subscriber editor', 'error');
            }
        }
        
        async deleteSubscriber(subscriberId) {
            if (confirm('Are you sure you want to delete this subscriber?')) {
                try {
                    const response = await fetch(`/mailer/subscribers/${subscriberId}/delete/`, {
                        method: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': this.getCsrfToken()
                        }
                    });
                    
                    const result = await response.json();
                    
                    if (result.status === 'ok') {
                        this.showNotification('Subscriber deleted successfully', 'success');
                        this.reloadPage();
                    } else {
                        throw new Error(result.errors || 'Failed to delete subscriber');
                    }
                } catch (error) {
                    this.showNotification('Failed to delete subscriber', 'error');
                }
            }
        }
        
        async exportSubscriber(subscriberId) {
            try {
                const response = await fetch(`/mailer/subscribers/${subscriberId}/export/`, {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `subscriber-${subscriberId}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    
                    this.showNotification('Subscriber exported successfully', 'success');
                } else {
                    throw new Error('Failed to export subscriber');
                }
            } catch (error) {
                this.showNotification('Failed to export subscriber', 'error');
            }
        }
        
        // Template actions
        async useTemplate(templateId) {
            try {
                window.location.href = `/mailer/campaigns/new/?template=${templateId}`;
            } catch (error) {
                this.showNotification('Failed to use template', 'error');
            }
        }
        
        async previewTemplate(templateId) {
            try {
                const response = await fetch(`/mailer/templates/${templateId}/preview/`, {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.showEmailPreviewModal(result.data.html, result.data.name);
                } else {
                    throw new Error(result.errors || 'Failed to load template preview');
                }
            } catch (error) {
                this.showNotification('Failed to load template preview', 'error');
            }
        }
        
        async duplicateTemplate(templateId) {
            try {
                const response = await fetch(`/mailer/templates/${templateId}/duplicate/`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': this.getCsrfToken()
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.showNotification('Template duplicated successfully', 'success');
                    this.reloadPage();
                } else {
                    throw new Error(result.errors || 'Failed to duplicate template');
                }
            } catch (error) {
                this.showNotification('Failed to duplicate template', 'error');
            }
        }
        
        // Email preview
        showEmailPreview(campaignId) {
            this.previewCampaign(campaignId);
        }
        
        showEmailPreviewModal(html, title) {
            const modal = document.createElement('div');
            modal.className = 'waboot-mailer__modal waboot-mailer__modal--preview';
            modal.innerHTML = `
                <div class="waboot-mailer__modal__overlay"></div>
                <div class="waboot-mailer__modal__content">
                    <div class="waboot-mailer__modal__header">
                        <h3>${title}</h3>
                        <button class="waboot-mailer__modal__close">&times;</button>
                    </div>
                    <div class="waboot-mailer__modal__body">
                        <iframe src="data:text/html;charset=utf-8,${encodeURIComponent(html)}" 
                                class="waboot-mailer__preview-iframe"></iframe>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal functionality
            const closeBtn = modal.querySelector('.waboot-mailer__modal__close');
            const overlay = modal.querySelector('.waboot-mailer__modal__overlay');
            
            const closeModal = () => {
                modal.remove();
            };
            
            closeBtn.addEventListener('click', closeModal);
            overlay.addEventListener('click', closeModal);
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });
        }
        
        // Campaign builder
        initializeCampaignBuilder(container) {
            // Initialize drag and drop for email blocks
            this.initializeDragAndDrop(container);
            
            // Initialize block controls
            this.initializeBlockControls(container);
            
            // Initialize property panel
            this.initializePropertyPanel(container);
        }
        
        initializeDragAndDrop(container) {
            const blocks = container.querySelectorAll('.waboot-mailer__block');
            const canvas = container.querySelector('.waboot-mailer__email-container');
            
            blocks.forEach(block => {
                block.setAttribute('draggable', true);
                
                block.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', block.dataset.blockType);
                });
            });
            
            if (canvas) {
                canvas.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    canvas.classList.add('waboot-mailer__email-container--drag-over');
                });
                
                canvas.addEventListener('dragleave', () => {
                    canvas.classList.remove('waboot-mailer__email-container--drag-over');
                });
                
                canvas.addEventListener('drop', (e) => {
                    e.preventDefault();
                    canvas.classList.remove('waboot-mailer__email-container--drag-over');
                    
                    const blockType = e.dataTransfer.getData('text/plain');
                    this.addBlockToCanvas(blockType, canvas);
                });
            }
        }
        
        initializeBlockControls(container) {
            const blockControls = container.querySelectorAll('.waboot-mailer__block-controls__btn');
            
            blockControls.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    const blockIndex = btn.closest('.waboot-mailer__email-block').dataset.index;
                    
                    switch (action) {
                        case 'edit':
                            this.editBlock(blockIndex);
                            break;
                        case 'delete':
                            this.deleteBlock(blockIndex);
                            break;
                        case 'duplicate':
                            this.duplicateBlock(blockIndex);
                            break;
                    }
                });
            });
        }
        
        initializePropertyPanel(container) {
            const propertyPanel = container.querySelector('.waboot-mailer__builder-properties');
            if (propertyPanel) {
                // Initialize property panel functionality
                this.setupPropertyPanel(propertyPanel);
            }
        }
        
        // Utility methods
        getCsrfToken() {
            return document.querySelector('meta[name="csrf-token"]')?.content || '';
        }
        
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `waboot-mailer__notification waboot-mailer__notification--${type}`;
            notification.textContent = message;
            
            const container = document.getElementById('waboot-mailer-notifications');
            if (container) {
                container.appendChild(notification);
                
                // Auto-remove after 5 seconds
                setTimeout(() => {
                    notification.remove();
                }, 5000);
            }
        }
        
        reloadPage() {
            window.location.reload();
        }
        
        hasUnsavedChanges() {
            // Check if there are unsaved changes in forms
            const forms = document.querySelectorAll('.waboot-mailer__form');
            return Array.from(forms).some(form => {
                const formData = new FormData(form);
                const originalData = form.dataset.originalData;
                return JSON.stringify(Object.fromEntries(formData)) !== originalData;
            });
        }
        
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        // Initialize Alpine.js components
        initializeAlpineComponents() {
            // This will be handled by the separate Alpine.js components file
            console.log('Alpine.js components initialized');
        }
        
        // Initialize tooltips
        initializeTooltips() {
            const tooltips = document.querySelectorAll('[data-tooltip]');
            tooltips.forEach(element => {
                element.addEventListener('mouseenter', () => {
                    this.showTooltip(element);
                });
                
                element.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
            });
        }
        
        // Initialize modals
        initializeModals() {
            const modalTriggers = document.querySelectorAll('[data-modal]');
            modalTriggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const modalId = trigger.dataset.modal;
                    this.openModal(modalId);
                });
            });
        }
        
        // Initialize dropdowns
        initializeDropdowns() {
            const dropdowns = document.querySelectorAll('.waboot-mailer__dropdown');
            dropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.waboot-mailer__dropdown__toggle');
                const menu = dropdown.querySelector('.waboot-mailer__dropdown__menu');
                
                if (toggle && menu) {
                    toggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        dropdown.classList.toggle('waboot-mailer__dropdown--open');
                    });
                    
                    // Close dropdown when clicking outside
                    document.addEventListener('click', (e) => {
                        if (!dropdown.contains(e.target)) {
                            dropdown.classList.remove('waboot-mailer__dropdown--open');
                        }
                    });
                }
            });
        }
    }
    
    // Initialize Waboot Mailer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new WabootMailer();
        });
    } else {
        new WabootMailer();
    }
    
    // Export for global access
    window.WabootMailer = WabootMailer;
    
})(); 