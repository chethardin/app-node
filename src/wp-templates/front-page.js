import { gql } from '@apollo/client';

export default function Component() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}

Component.query = gql`
  query GetFrontPage {
    generalSettings {
      title
    }
  }
`; 