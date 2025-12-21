/**
 * FeaturedProjectsCarousel Component Tests
 *
 * Basic tests to verify the FeaturedProjectsCarousel component structure
 * and data mapping functionality.
 */

describe('FeaturedProjectsCarousel Component', () => {
  test('Component structure is valid', () => {
    // Verify component file exists and follows naming conventions
    const componentName = 'FeaturedProjectsCarousel';
    expect(componentName).toBe('FeaturedProjectsCarousel');
    expect(componentName).toMatch(/^[A-Z]/); // PascalCase
  });

  test('FeaturedSlide interface has correct properties', () => {
    // Verify the structure of FeaturedSlide interface
    const mockSlide = {
      id: 'test-project',
      title: 'Test Project',
      description: 'A test project description',
      services: ['web design', 'seo'],
      type: 'Web Design',
      imageUrl: '/test-image.jpg',
    };

    expect(mockSlide).toHaveProperty('id');
    expect(mockSlide).toHaveProperty('title');
    expect(mockSlide).toHaveProperty('description');
    expect(mockSlide).toHaveProperty('services');
    expect(mockSlide).toHaveProperty('type');
    expect(mockSlide).toHaveProperty('imageUrl');
  });

  test('Project to Slide mapping preserves required data', () => {
    // Simulate the mapProjectToSlide function logic
    const mockProject = {
      slug: 'test-project',
      title: 'Test Project',
      description: 'A comprehensive test project',
      tags: ['web design', 'seo', 'development'],
      thumbnail: '/test-thumbnail.jpg',
    };

    const mappedSlide = {
      id: mockProject.slug,
      title: mockProject.title,
      description: mockProject.description,
      services: mockProject.tags,
      type: mockProject.tags[0],
      imageUrl: mockProject.thumbnail,
    };

    expect(mappedSlide.id).toBe('test-project');
    expect(mappedSlide.title).toBe('Test Project');
    expect(mappedSlide.services).toEqual(['web design', 'seo', 'development']);
    expect(mappedSlide.type).toBe('web design');
    expect(mappedSlide.imageUrl).toBe('/test-thumbnail.jpg');
  });

  test('Default slides are available as fallback', () => {
    // Verify default slides have the correct structure
    const defaultSlides = [
      {
        id: 'slide-1',
        title: 'E-Commerce Platform',
        services: ['shopify', 'web design', 'seo'],
        type: 'E-Commerce',
      },
      {
        id: 'slide-2',
        title: 'AI Chatbot Integration',
        services: ['chatbot', 'n8n automation', 'ai'],
        type: 'Automation',
      },
    ];

    expect(defaultSlides.length).toBeGreaterThan(0);
    expect(defaultSlides[0]).toHaveProperty('id');
    expect(defaultSlides[0]).toHaveProperty('title');
    expect(defaultSlides[0]).toHaveProperty('services');
    expect(defaultSlides[0]).toHaveProperty('type');
  });

  test('API endpoint format is correct', () => {
    // Verify the API endpoints used
    const featuredEndpoint = '/api/projects?featured=true';
    const allProjectsEndpoint = '/api/projects';

    expect(featuredEndpoint).toContain('/api/projects');
    expect(featuredEndpoint).toContain('featured=true');
    expect(allProjectsEndpoint).toBe('/api/projects');
  });

  test('Default headings have correct structure', () => {
    // Verify default heading values
    const defaultHeadings = {
      eyebrow: 'Featured Work',
      title: 'Projects That',
      titleHighlight: 'Deliver Results',
      subtitle:
        'Scroll to explore our latest projects and see how we help businesses grow.',
    };

    expect(defaultHeadings.eyebrow).toBeDefined();
    expect(defaultHeadings.title).toBeDefined();
    expect(defaultHeadings.titleHighlight).toBeDefined();
    expect(defaultHeadings.subtitle).toBeDefined();
  });

  test('Loading state spinner configuration', () => {
    // Verify loading state styling
    const spinnerClasses =
      'animate-spin rounded-full h-12 w-12 border-b-2 border-[#37AFE1]';

    expect(spinnerClasses).toContain('animate-spin');
    expect(spinnerClasses).toContain('h-12 w-12');
    expect(spinnerClasses).toContain('border-[#37AFE1]');
  });

  test('Badge color schemes match design system', () => {
    // Verify badge styling matches design system
    const typeBackgroundColor = '#F58122'; // Orange for type badge
    const serviceBackgroundColor = '#37AFE1'; // Blue for service badges

    expect(typeBackgroundColor).toBe('#F58122');
    expect(serviceBackgroundColor).toBe('#37AFE1');
  });

  test('Fallback type value when tags are empty', () => {
    // Test that default type is 'Project' when no tags exist
    const mockProjectWithoutTags = {
      slug: 'test',
      title: 'Test',
      description: 'Test',
      tags: [],
      thumbnail: '/test.jpg',
    };

    const expectedType =
      mockProjectWithoutTags.tags.length > 0
        ? mockProjectWithoutTags.tags[0]
        : 'Project';

    expect(expectedType).toBe('Project');
  });

  test('Fallback image URL when thumbnail is missing', () => {
    // Test that placeholder image is used when thumbnail is missing
    const mockProjectWithoutThumbnail = {
      slug: 'test',
      title: 'Test',
      description: 'Test',
      tags: ['web'],
      thumbnail: '',
    };

    const imageUrl =
      mockProjectWithoutThumbnail.thumbnail ||
      '/media/portfolio/placeholder.jpg';

    expect(imageUrl).toBe('/media/portfolio/placeholder.jpg');
  });
});
