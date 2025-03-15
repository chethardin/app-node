import { useAuth, getApolloAuthClient, useLogout } from "@faustwp/core";
import { gql, useQuery } from "@apollo/client";
 
function AuthenticatedView() {
	const client = getApolloAuthClient();
	const { logout } = useLogout();
	const { data, loading } = useQuery(
		gql`
			{
				viewer {
					name
				}
			}
		`,
		{ client },
	);
 
	if (loading) {
		return <>Loading...</>;
	}
 
	return (
		<>
			<p>Welcome {data?.viewer?.name}!</p>
			<button onClick={() => logout("/")}>Logout</button>
		</>
	);
}
 
export default function Page() {
	const { isAuthenticated, isReady, loginUrl } = useAuth();
 
	if (!isReady) {
		return <>Loading...</>;
	}
 
	if (isAuthenticated === true) {
		return <AuthenticatedView />;
	}
 
	return (
		<>
			<p>Welcome!</p>
			<a href={loginUrl}>Login</a>
		</>
	);
}