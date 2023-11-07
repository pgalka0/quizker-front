import { Dashboard } from './components/dashboard';
import { TabProvider } from './context/tabProvider';

function App() {
	return (
		<>
			<TabProvider>
				<Dashboard />
			</TabProvider>
		</>
	);
}

export default App;
