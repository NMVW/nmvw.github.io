/* Local Storage */

export class DomainService {

  static dataStore = [
    [
      { postId: 1, title: 'Blog Intro', keywords: ["meta", "philosophy"] },
      { postId: 2, title: 'Post Test', keywords: ["remote", "test"] },
      { postId: 3, title: 'Sensitivity Analysis', keywords: ["data science", "analytics"] },
      { postId: 4, title: 'Hit the Road', keywords: ["meta", "philosophy"] },
      { postId: 5, title: 'Remote Life', keywords: ["remote", "test", "happiness"] },
      { postId: 6, title: 'Easy Rider', keywords: ["data science", "analytics"] },
    ],
    [
      { postId: 7, title: 'Blog Outro', keywords: ["meta", "philosophy"] },
      { postId: 8, title: 'Post Complete', keywords: ["remote", "test"] },
      { postId: 9, title: 'Brute Analysis', keywords: ["data science", "analytics"] },
      { postId: 10, title: 'Hit the Waves', keywords: ["meta", "philosophy"] },
      { postId: 11, title: 'Grounded', keywords: ["remote", "test", "happiness"] },
      { postId: 12, title: 'Filet Mignon', keywords: ["data science", "analytics"] },
    ]
  ];

  static interface () {
    // graphql setup
  }

  constructor (env) {
    // include any client api configuration here (protocol, headers, etc.)
  }

  getPost (postId) {
    const metaData = _.find(DomainService.dataStore[0], post => post.postId === postId);
    const id = `post_${postId}`;
    const content = localStorage.getItem(id);
    return Promise.resolve({
      ...metaData,
      content
    });
  }

  getPosts (cursor=0) {
    // mock data api response
    return Promise.resolve(DomainService.dataStore[cursor]);
  }
}
