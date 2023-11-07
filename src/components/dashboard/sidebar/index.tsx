import { Button } from '@/components/ui/button';
import { Tab, useTabProvider } from '@/context/tabProvider';

type Option = {
	text: string;
	action: () => void;
};

export const Sidebar = () => {
	const { tab, setTab } = useTabProvider();

	const options: Option[] = [
		{ text: 'Quiz', action: () => setTab(Tab.Quiz) },
		{ text: 'Question', action: () => setTab(Tab.Question) },
		{ text: 'Class', action: () => setTab(Tab.Class) },
		{ text: 'Students', action: () => setTab(Tab.Students) },
	];
	return (
		<div className="flex items-center justify-start flex-col gap-[4px] w-[200px]">
			{options.map((option: Option) => (
				<Button
					onClick={option.action}
					variant={option.text === tab ? 'secondary' : 'ghost'}
					className="w-full"
				>
					{option.text}
				</Button>
			))}
		</div>
	);
};
