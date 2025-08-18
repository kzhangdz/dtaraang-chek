export interface IPost {
  inputUrl: string;
  id: string;
//   type: 'Sidecar' | 'Image' | 'Video';
//   shortCode: string;
  caption: string;
//   hashtags: string[];
//   mentions: string[];
  url: string;
//   commentsCount: number;
//   firstComment: string;
//   latestComments: string[];
//   dimensionsHeight: number;
//   dimensionsWidth: number;
  displayUrl: string;
  images: string[];
//   alt: string;
//   likesCount: number;
//   timestamp: string;
//   childPosts: Post[];
  ownerFullName: string;
  ownerUsername: string;
//   ownerId: string;
//   isSponsored: boolean;
//   isPinned: boolean;
//   isCommentsDisabled: boolean;
}