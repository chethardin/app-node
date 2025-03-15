import { gql } from '@apollo/client';

export const ThemeOptionsFragment = gql`
  fragment ThemeOptionsFragment on ThemeGeneralOptions {
    themeOptionsGeneral {
      heroDesc404
      heroTitle404
      newsArchiveDesc
      newsArchiveTitle
      postCopyrightText
      searchFallbackImg {
        node {
          altText
          sizes
          srcSet
          mediaItemUrl
        }
      }
      shareLabel
      siteSearchPlaceholder
      xHandle
      socialIcons {
        socialUrl
        connectType
      }
      shareButtons {
        shareType
      }
    }
  }
`; 