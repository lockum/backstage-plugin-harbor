import { parseHarborSlug } from './useHarborAppData';

describe('parseHarborSlug', () => {
  it('parses two-part slug without host (project/repository)', () => {
    const result = parseHarborSlug('my-project/my-repo');
    expect(result).toEqual({
      host: '',
      project: 'my-project',
      repository: 'my-repo',
      slug: 'my-project/my-repo',
    });
  });

  it('parses three-part slug without host (project/subproject/repository)', () => {
    const result = parseHarborSlug('my-project/subproject/my-repo');
    expect(result).toEqual({
      host: '',
      project: 'my-project',
      repository: 'subproject/my-repo',
      slug: 'my-project/subproject/my-repo',
    });
  });

  it('parses multi-part slug without host (project/path1/path2/repository)', () => {
    const result = parseHarborSlug('my-project/path1/path2/my-repo');
    expect(result).toEqual({
      host: '',
      project: 'my-project',
      repository: 'path1/path2/my-repo',
      slug: 'my-project/path1/path2/my-repo',
    });
  });

  it('parses three-part slug with host (host/project/repository)', () => {
    const result = parseHarborSlug('harbor.example.com/my-project/my-repo');
    expect(result).toEqual({
      host: 'harbor.example.com',
      project: 'my-project',
      repository: 'my-repo',
      slug: 'harbor.example.com/my-project/my-repo',
    });
  });

  it('parses multi-part slug with host (host/project/subproject/repository)', () => {
    const result = parseHarborSlug(
      'harbor.example.com/my-project/subproject/my-repo',
    );
    expect(result).toEqual({
      host: 'harbor.example.com',
      project: 'my-project',
      repository: 'subproject/my-repo',
      slug: 'harbor.example.com/my-project/subproject/my-repo',
    });
  });

  it('parses multi-part slug with host containing port', () => {
    const result = parseHarborSlug(
      'harbor.example.com:8443/my-project/path1/path2/my-repo',
    );
    expect(result).toEqual({
      host: 'harbor.example.com:8443',
      project: 'my-project',
      repository: 'path1/path2/my-repo',
      slug: 'harbor.example.com:8443/my-project/path1/path2/my-repo',
    });
  });

  it('parses localhost with multi-part slug', () => {
    const result = parseHarborSlug('localhost:8080/my-project/sub/my-repo');
    expect(result).toEqual({
      host: 'localhost:8080',
      project: 'my-project',
      repository: 'sub/my-repo',
      slug: 'localhost:8080/my-project/sub/my-repo',
    });
  });

  it('handles whitespace around slug gracefully', () => {
    const result = parseHarborSlug('  my-project/path1/path2/my-repo  ');
    expect(result).toEqual({
      host: '',
      project: 'my-project',
      repository: 'path1/path2/my-repo',
      slug: 'my-project/path1/path2/my-repo',
    });
  });
});

