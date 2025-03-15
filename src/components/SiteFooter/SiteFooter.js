import { gql } from '@apollo/client';
import AnchorLinks from '../../utils/anchors/anchors';

export const FOOTER_FRAGMENT = gql`
  fragment FooterFragment on ThemeGeneralOptions {
    themeOptionsGeneral {
      postCopyrightText
    }
  }
`;

const SiteFooter = ({ footerMenu, themeOptions }) => {
    const postCopyrightText = themeOptions?.postCopyrightText;
  
    return (
        <>
            <footer className="site-footer">
            {footerMenu?.length > 0 && (
                <nav className="footer-navigation">
                <ul>
                    {footerMenu.map((menuItem) => (
                    <li key={menuItem.id}>{menuItem.label}</li>
                    ))}
                </ul>
                </nav>
            )}
            {postCopyrightText && (
                <div className="copyright">
                    <p>{postCopyrightText}</p>
                </div>
            )}
            </footer>
            <AnchorLinks />
        </>
    );
}

SiteFooter.fragments = {
    themeOptions: FOOTER_FRAGMENT
};

export default SiteFooter;