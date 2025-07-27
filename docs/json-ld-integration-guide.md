# JSON-LD Structured Data Integration Guide
## Comprehensive Schema.org Implementation for Waboot Theme System

**Project**: Waboot Theme - WordPress to Webasyst Migration  
**Focus**: Mandatory JSON-LD Structured Data Integration  
**Updated**: January 16, 2025  
**Status**: Implementation Phase - All Components Required  

---

## 🎯 **OVERVIEW**

This guide provides comprehensive implementation details for JSON-LD structured data integration across all Waboot theme components. Following Google's guidelines and schema.org standards, every eligible component must include proper structured data markup to enhance SEO performance, enable rich results, and optimize for voice search.

### **🚀 Key Benefits of JSON-LD Integration**

- **Rich Results**: Enhanced search result appearance with star ratings, prices, and images
- **Voice Search Optimization**: Better compatibility with voice assistants (Google Assistant, Siri, Alexa)
- **Improved SEO**: Better search engine understanding of content context and relationships
- **Featured Snippets**: Higher chances of appearing in Google's featured snippets
- **Local SEO**: Enhanced visibility in local search results with LocalBusiness schema
- **E-commerce Performance**: Product rich results with pricing, availability, and reviews

---

## 📊 **MANDATORY SCHEMA IMPLEMENTATION**

### **Core Schema Types - Required for All Applications**

#### **1. WebSite Schema** (Homepage & All Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "{$wa_domain}/#website",
  "url": "{$wa_domain}/",
  "name": "{$wa->accountName()}",
  "description": "{$wa->account()->description|default:'Modern e-commerce website powered by Webasyst'}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "{$wa_domain}/search/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "{$wa_domain}/#organization"
  }
}
```

#### **2. Organization Schema** (All Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "{$wa_domain}/#organization",
  "name": "{$wa->accountName()}",
  "url": "{$wa_domain}/",
  "logo": {
    "@type": "ImageObject",
    "url": "{$wa_theme_url}images/logo.png",
    "width": "200",
    "height": "60"
  },
  "sameAs": [
    "{if $social_facebook}https://www.facebook.com/{$social_facebook}{/if}",
    "{if $social_instagram}https://www.instagram.com/{$social_instagram}{/if}",
    "{if $social_twitter}https://twitter.com/{$social_twitter}{/if}",
    "{if $social_linkedin}https://www.linkedin.com/company/{$social_linkedin}{/if}"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "{$contact_phone|default:'+1-555-555-5555'}",
    "contactType": "customer service",
    "areaServed": ["{$contact_country|default:'US'}"],
    "availableLanguage": ["{$contact_language|default:'English'}"]
  }
}
```

#### **3. LocalBusiness Schema** (Business Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "{$wa_domain}/#localbusiness",
  "name": "{$wa->accountName()}",
  "image": "{$wa_theme_url}images/business-photo.jpg",
  "description": "{$business_description}",
  "url": "{$wa_domain}/",
  "telephone": "{$contact_phone}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{$business_address}",
    "addressLocality": "{$business_city}",
    "addressRegion": "{$business_state}",
    "postalCode": "{$business_zip}",
    "addressCountry": "{$business_country}"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "{$business_latitude}",
    "longitude": "{$business_longitude}"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "priceRange": "{$business_price_range|default:'$$'}",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{$business_rating|default:'4.5'}",
    "reviewCount": "{$business_review_count|default:'25'}"
  }
}
```

---

## 🛒 **E-COMMERCE SCHEMAS (Shop-Script)**

### **4. Product Schema** (Product Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "{$product.frontend_url}#product",
  "name": "{$product.name}",
  "description": "{$product.summary}",
  "image": [
    {foreach $product.images as $image}
    "{$image.url}"
    {if !$image@last},{/if}
    {/foreach}
  ],
  "brand": {
    "@type": "Brand",
    "name": "{$product.brand|default:$wa->accountName()}"
  },
  "sku": "{$product.sku}",
  "mpn": "{$product.sku}",
  "offers": {
    "@type": "Offer",
    "url": "{$product.frontend_url}",
    "priceCurrency": "{$product.currency}",
    "price": "{$product.price}",
    "priceValidUntil": "{date('Y-m-d', strtotime('+1 year'))}",
    "availability": "{if $product.count > 0}https://schema.org/InStock{else}https://schema.org/OutOfStock{/if}",
    "seller": {
      "@type": "Organization",
      "@id": "{$wa_domain}/#organization"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{$product.rating|default:'4.0'}",
    "reviewCount": "{$product.reviews_count|default:'1'}"
  },
  "review": [
    {foreach $product.reviews as $review}
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "{$review.rate}",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "{$review.name}"
      },
      "reviewBody": "{$review.text}",
      "datePublished": "{$review.datetime}"
    }{if !$review@last},{/if}
    {/foreach}
  ]
}
```

### **5. Review Schema** (Product Reviews)
```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Product",
    "name": "{$product.name}",
    "@id": "{$product.frontend_url}#product"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "{$review.rate}",
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Person",
    "name": "{$review.name}"
  },
  "reviewBody": "{$review.text}",
  "datePublished": "{$review.datetime}",
  "publisher": {
    "@type": "Organization",
    "@id": "{$wa_domain}/#organization"
  }
}
```

---

## 📝 **CONTENT SCHEMAS (Blog Application)**

### **6. BlogPosting Schema** (Blog Posts)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "{$post.frontend_url}#blogpost",
  "headline": "{$post.title}",
  "alternativeHeadline": "{$post.title}",
  "description": "{$post.summary}",
  "image": {
    "@type": "ImageObject",
    "url": "{$post.image.url}",
    "width": "{$post.image.width|default:'1200'}",
    "height": "{$post.image.height|default:'630'}"
  },
  "author": {
    "@type": "Person",
    "name": "{$post.contact.name}",
    "url": "{$wa_domain}/blog/author/{$post.contact.id}/",
    "image": {
      "@type": "ImageObject",
      "url": "{$post.contact.photo_url}"
    }
  },
  "publisher": {
    "@type": "Organization",
    "@id": "{$wa_domain}/#organization"
  },
  "datePublished": "{$post.datetime}",
  "dateModified": "{$post.update_datetime|default:$post.datetime}",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{$post.frontend_url}"
  },
  "articleSection": "{$post.blog.name}",
  "keywords": [
    {foreach $post.tags as $tag}
    "{$tag.name}"{if !$tag@last},{/if}
    {/foreach}
  ],
  "wordCount": "{$post.text|strip_tags|str_word_count}",
  "commentCount": "{$post.comments_count|default:0}"
}
```

### **7. Person Schema** (Author Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "{$wa_domain}/author/{$author.id}/#person",
  "name": "{$author.name}",
  "givenName": "{$author.firstname}",
  "familyName": "{$author.lastname}",
  "image": {
    "@type": "ImageObject",
    "url": "{$author.photo_url}"
  },
  "description": "{$author.about}",
  "url": "{$wa_domain}/author/{$author.id}/",
  "sameAs": [
    "{if $author.social_facebook}https://www.facebook.com/{$author.social_facebook}{/if}",
    "{if $author.social_twitter}https://twitter.com/{$author.social_twitter}{/if}",
    "{if $author.social_linkedin}https://www.linkedin.com/in/{$author.social_linkedin}{/if}"
  ],
  "worksFor": {
    "@type": "Organization",
    "@id": "{$wa_domain}/#organization"
  },
  "jobTitle": "{$author.job_title|default:'Content Author'}"
}
```

---

## ❓ **FAQ SCHEMA IMPLEMENTATION**

### **8. FAQ Schema** (FAQ Pages & Components)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "{$wa_url}faq/#faqpage",
  "mainEntity": [
    {foreach $faqs as $faq}
    {
      "@type": "Question",
      "name": "{$faq.question}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{$faq.answer}"
      }
    }{if !$faq@last},{/if}
    {/foreach}
  ]
}
```

### **9. HowTo Schema** (Tutorial Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "{$tutorial.title}",
  "description": "{$tutorial.description}",
  "image": {
    "@type": "ImageObject",
    "url": "{$tutorial.image}"
  },
  "totalTime": "{$tutorial.duration|default:'PT30M'}",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "{$tutorial.cost|default:'0'}"
  },
  "supply": [
    {foreach $tutorial.supplies as $supply}
    {
      "@type": "HowToSupply",
      "name": "{$supply.name}"
    }{if !$supply@last},{/if}
    {/foreach}
  ],
  "tool": [
    {foreach $tutorial.tools as $tool}
    {
      "@type": "HowToTool",
      "name": "{$tool.name}"
    }{if !$tool@last},{/if}
    {/foreach}
  ],
  "step": [
    {foreach $tutorial.steps as $step}
    {
      "@type": "HowToStep",
      "name": "{$step.title}",
      "text": "{$step.description}",
      "image": {
        "@type": "ImageObject",
        "url": "{$step.image}"
      }
    }{if !$step@last},{/if}
    {/foreach}
  ]
}
```

---

## 🎪 **EVENT & COMMUNITY SCHEMAS**

### **10. Event Schema** (Hub Application)
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "@id": "{$event.frontend_url}#event",
  "name": "{$event.name}",
  "description": "{$event.description}",
  "startDate": "{$event.start_datetime}",
  "endDate": "{$event.end_datetime}",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "{if $event.is_online}https://schema.org/OnlineEventAttendanceMode{else}https://schema.org/OfflineEventAttendanceMode{/if}",
  "location": {
    "@type": "{if $event.is_online}VirtualLocation{else}Place{/if}",
    {if $event.is_online}
    "url": "{$event.online_url}"
    {else}
    "name": "{$event.location_name}",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "{$event.location_address}",
      "addressLocality": "{$event.location_city}",
      "addressRegion": "{$event.location_state}",
      "postalCode": "{$event.location_zip}",
      "addressCountry": "{$event.location_country}"
    }
    {/if}
  },
  "image": {
    "@type": "ImageObject",
    "url": "{$event.image}"
  },
  "organizer": {
    "@type": "Organization",
    "@id": "{$wa_domain}/#organization"
  },
  "offers": {
    "@type": "Offer",
    "url": "{$event.frontend_url}",
    "price": "{$event.price|default:'0'}",
    "priceCurrency": "{$event.currency|default:'USD'}",
    "availability": "https://schema.org/InStock"
  }
}
```

---

## 📧 **SERVICE SCHEMAS (Mailer & Helpdesk)**

### **11. Service Schema** (Service Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "{$service.frontend_url}#service",
  "name": "{$service.name}",
  "description": "{$service.description}",
  "provider": {
    "@type": "Organization",
    "@id": "{$wa_domain}/#organization"
  },
  "serviceType": "{$service.category}",
  "areaServed": {
    "@type": "Place",
    "name": "{$service.area_served|default:'Worldwide'}"
  },
  "offers": {
    "@type": "Offer",
    "price": "{$service.price}",
    "priceCurrency": "{$service.currency}",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{$service.rating|default:'4.5'}",
    "reviewCount": "{$service.review_count|default:'10'}"
  }
}
```

---

## 🔧 **IMPLEMENTATION GUIDELINES**

### **Template Integration Approach**

#### **1. Main Layout Integration** (`layout.html`)
```smarty
{* Main Layout with Core Schemas *}
<!DOCTYPE html>
<html lang="{$locale}">
<head>
    <meta charset="utf-8">
    <title>{block name="title"}{$wa->accountName()}{/block}</title>
    
    {* Core JSON-LD Schemas - Always Present *}
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {include file="schemas/website-schema.json"},
        {include file="schemas/organization-schema.json"}
        {if $business_address}, {include file="schemas/localbusiness-schema.json"}{/if}
      ]
    }
    </script>
    
    {* Page-Specific JSON-LD *}
    {block name="json_ld"}{/block}
</head>
<body>
    {block name="content"}{/block}
</body>
</html>
```

#### **2. Component-Specific Schema Integration**

**Product Card Molecule** (`molecules/product-card.html`)
```smarty
{* Product Card with JSON-LD *}
<div class="waboot-shop__product-card" itemscope itemtype="https://schema.org/Product">
    <meta itemprop="url" content="{$product.frontend_url}">
    <meta itemprop="name" content="{$product.name}">
    
    {* Product Card Content *}
    <div class="waboot-shop__product-card__image">
        <img src="{$product.image}" alt="{$product.name}" itemprop="image">
    </div>
    
    <div class="waboot-shop__product-card__content">
        <h3 class="waboot-shop__product-card__title" itemprop="name">{$product.name}</h3>
        <div class="waboot-shop__product-card__price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <span itemprop="price" content="{$product.price}">{$product.price_formatted}</span>
            <meta itemprop="priceCurrency" content="{$product.currency}">
        </div>
    </div>
    
    {* JSON-LD Schema for this specific product *}
    <script type="application/ld+json">
    {include file="schemas/product-schema.json" product=$product}
    </script>
</div>
```

#### **3. Dynamic Schema Generation**

**Schema Generation Helper** (`lib/schemaHelper.class.php`)
```php
<?php

class waSchemaHelper 
{
    /**
     * Generate Product Schema
     */
    public static function generateProductSchema($product) 
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Product',
            '@id' => $product['frontend_url'] . '#product',
            'name' => $product['name'],
            'description' => $product['summary'],
            'image' => array_map(function($img) { return $img['url']; }, $product['images']),
            'sku' => $product['sku'],
            'offers' => [
                '@type' => 'Offer',
                'url' => $product['frontend_url'],
                'priceCurrency' => $product['currency'],
                'price' => $product['price'],
                'availability' => $product['count'] > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
            ]
        ];
    }
    
    /**
     * Generate Organization Schema
     */
    public static function generateOrganizationSchema() 
    {
        $wa = wa();
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            '@id' => $wa->getRouteUrl('/', [], true) . '#organization',
            'name' => $wa->accountName(),
            'url' => $wa->getRouteUrl('/', [], true),
            'logo' => $wa->getDataUrl('logo.png', true)
        ];
    }
}
```

### **Validation & Testing**

#### **1. Google Rich Results Test**
- URL: https://search.google.com/test/rich-results
- Test all templates with schema markup
- Validate JSON-LD syntax and structure
- Check for required properties

#### **2. Schema Markup Validator**
- URL: https://validator.schema.org/
- Validate schema.org compliance
- Check property requirements
- Ensure proper nesting

#### **3. Automated Testing Integration**
```bash
# Schema validation script
#!/bin/bash
echo "Validating JSON-LD schemas..."

# Test product pages
curl -s "https://yourdomain.com/product/sample/" | \
  grep -oP '(?<=<script type="application/ld\+json">).*?(?=</script>)' | \
  jq '.' > /tmp/product-schema.json

# Validate with schema.org API
curl -X POST "https://validator.schema.org/validate" \
  -H "Content-Type: application/json" \
  -d @/tmp/product-schema.json

echo "Schema validation complete"
```

---

## 📈 **PERFORMANCE OPTIMIZATION**

### **1. Efficient JSON-LD Loading**

**Lazy Schema Loading** (Advanced Implementation)
```javascript
// Alpine.js component for dynamic schema loading
Alpine.data('schemaLoader', () => ({
    schemas: {},
    
    async loadSchema(type, data) {
        if (!this.schemas[type]) {
            const response = await fetch(`/api/schema/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            this.schemas[type] = await response.json();
            this.injectSchema(this.schemas[type]);
        }
    },
    
    injectSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }
}));
```

### **2. Caching Strategy**

**Schema Caching Implementation**
```php
<?php

class waSchemaCache 
{
    private static $cache = [];
    
    public static function getSchema($key, $generator, $ttl = 3600) 
    {
        if (isset(self::$cache[$key])) {
            return self::$cache[$key];
        }
        
        $cached = wa()->getCache()->get($key);
        if ($cached !== null) {
            return self::$cache[$key] = $cached;
        }
        
        $schema = call_user_func($generator);
        wa()->getCache()->set($key, $schema, $ttl);
        
        return self::$cache[$key] = $schema;
    }
}
```

---

## 🎯 **SEO IMPACT MEASUREMENT**

### **Key Performance Indicators**

| Metric | Before JSON-LD | Target After | Measurement Tool |
|--------|----------------|--------------|------------------|
| **Rich Results Eligibility** | 20% | 95% | Google Search Console |
| **Featured Snippets** | 5% | 25% | SEMrush/Ahrefs |
| **Voice Search Optimization** | Poor | Excellent | Voice Search Analytics |
| **Local Pack Visibility** | 30% | 80% | Local SEO Tools |
| **Product Rich Results** | 0% | 90% | Google Merchant Center |
| **Click-Through Rate** | 2.5% | 4.5% | Google Analytics |

### **Monitoring Implementation**

**Schema Performance Tracking**
```javascript
// Google Analytics 4 Event Tracking
gtag('event', 'schema_impression', {
  'schema_type': 'Product',
  'page_url': window.location.href,
  'has_rich_result': document.querySelector('[data-rich-result="true"]') !== null
});

// Schema Error Monitoring
window.addEventListener('error', (e) => {
  if (e.target.type === 'application/ld+json') {
    gtag('event', 'schema_error', {
      'error_message': e.message,
      'schema_content': e.target.textContent.substring(0, 100)
    });
  }
});
```

---

## 🔧 **TROUBLESHOOTING GUIDE**

### **Common Issues & Solutions**

#### **1. Schema Validation Errors**

**Error**: Missing required property
```json
// ❌ Incorrect - Missing required properties
{
  "@type": "Product",
  "name": "Sample Product"
}

// ✅ Correct - All required properties included
{
  "@type": "Product",
  "name": "Sample Product",
  "image": "https://example.com/image.jpg",
  "description": "Product description",
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD"
  }
}
```

#### **2. Smarty Template Integration**

**Error**: Undefined variables in templates
```smarty
{* ❌ Incorrect - Variables may not exist *}
{$product.nonexistent_field}

{* ✅ Correct - Always provide defaults *}
{$product.description|default:'No description available'}
```

#### **3. Dynamic Content Issues**

**Error**: Empty arrays in JSON-LD
```smarty
{* ❌ Incorrect - May produce empty arrays *}
"image": [
  {foreach $product.images as $image}
  "{$image.url}"{if !$image@last},{/if}
  {/foreach}
]

{* ✅ Correct - Check if images exist *}
{if $product.images}
"image": [
  {foreach $product.images as $image}
  "{$image.url}"{if !$image@last},{/if}
  {/foreach}
]
{/if}
```

---

## 🚀 **NEXT STEPS & ROADMAP**

### **Immediate Implementation (Sprint 1)**
- [ ] Audit all existing templates for JSON-LD compliance
- [ ] Implement core schemas (WebSite, Organization, LocalBusiness)
- [ ] Add Product schema to all e-commerce components
- [ ] Create FAQ schema for support content
- [ ] Validate all implementations with Google Rich Results Test

### **Advanced Features (Sprint 2)**
- [ ] Implement dynamic schema generation based on page content
- [ ] Add Review and Rating schemas across all applications
- [ ] Create Event schema for Hub community features
- [ ] Implement Service schema for business offerings
- [ ] Add Person schema for author and team pages

### **Optimization (Sprint 3)**
- [ ] Implement schema caching for performance
- [ ] Create automated validation testing
- [ ] Set up monitoring for rich result performance
- [ ] A/B test schema variations for optimal results
- [ ] Create schema customization interface for non-technical users

---

## 📚 **RESOURCES & REFERENCES**

### **Official Documentation**
- [Schema.org Documentation](https://schema.org/docs/documents.html)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)
- [JSON-LD Specification](https://json-ld.org/spec/latest/json-ld/)

### **Validation Tools**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [JSON-LD Playground](https://json-ld.org/playground/)

### **Performance Tools**
- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse SEO Audit](https://web.dev/lighthouse-seo/)

---

## 🎉 **SUCCESS METRICS**

This comprehensive JSON-LD implementation will deliver:

- **100% Schema Coverage**: All eligible components include proper structured data
- **95%+ Rich Results Eligibility**: Enhanced search result appearance
- **Voice Search Ready**: Optimized for voice assistant queries
- **Local SEO Enhanced**: Improved local search visibility
- **E-commerce Optimized**: Product rich results with enhanced information
- **Future-Proof**: Scalable schema architecture for continued development

*Implementing JSON-LD structured data transforms the Waboot theme system into a cutting-edge, SEO-optimized platform that leverages the full power of modern search engine capabilities.*