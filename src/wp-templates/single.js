import { gql } from "@apollo/client";
import * as MENUS from '../constants/menus';
import { SiteInfoFragment } from '../fragments/GeneralSettings';
import { ThemeOptionsFragment } from '../fragments/ThemeOptions';
import { PageProvider } from '../context/PageContext';
import { NavigationMenuItemFragment } from '../fragments/NavigationItems';
import classNames from 'classnames/bind';
import styles from "../styles/modules/SinglePost.module.scss";

import {
	SiteHead,
	Hero,
	FeaturedImage,
	SiteFooter,
	Header,
	Main,
} from '../components';

const cx = classNames.bind(styles);
export default function Component(props) {
	if (props.loading) {
		return <>Loading...</>;
	}
	
	const { seo } = props?.data?.post;
	const { title: siteTitle, description: siteDescription } = props?.data?.generalSettings || {};
	const pageLink = props?.data?.post?.link;
	const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
	const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
	const themeOptions = props?.data?.themeGeneralOptions?.themeOptionsGeneral;

	return (
		<PageProvider pageLink={pageLink}>
			<SiteHead fullHead={seo?.fullHead} />
			<Header
				title={siteTitle || ''}
				description={siteDescription || ''}
				menuItems={primaryMenu}
			/>
			<Main className={`${cx('main')} grid grid--full light-area"`} role={'main'}>
				<Hero 
					page={props?.data?.post}
				/>
			</Main>
			<SiteFooter 
				footerMenu={footerMenu}
				themeOptions={themeOptions}
			/>
		</PageProvider>
	);
}
 
Component.query = gql`
	${SiteInfoFragment}
	${NavigationMenuItemFragment}
	${SiteFooter.fragments.themeOptions}
	query GetPost(
		$databaseId: ID!, 
		$asPreview: Boolean = false,
		$headerLocation: MenuLocationEnum,
		$footerLocation: MenuLocationEnum
	) {
		post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			title
			content
			seo {
				metaDesc
				title
				fullHead
			}
		}
		generalSettings {
			...SiteInfoFragment
		}
		footerMenuItems: menuItems(where: { location: $footerLocation }) {
			nodes {
				...NavigationMenuItemFragment
			}
		}
		headerMenuItems: menuItems(where: { location: $headerLocation }) {
			nodes {
				...NavigationMenuItemFragment
			}
		}
		themeGeneralOptions {
			...FooterFragment
		}
	}
`;

// Variables function to provide the required arguments to the query
Component.variables = ({ databaseId }, ctx) => {
	return {
		databaseId,
		headerLocation: MENUS.PRIMARY_LOCATION,
		footerLocation: MENUS.FOOTER_LOCATION,
		asPreview: ctx?.asPreview,
	};
};