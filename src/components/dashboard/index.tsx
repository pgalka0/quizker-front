import { Tab, useTabProvider } from '@/context/tabProvider';
import { Sidebar } from './sidebar';
import { QuizTab } from './sidebar/tabs/quiz';
import { QuestionsTab } from './sidebar/tabs/questions';
import { ClassesTab } from './sidebar/tabs/classes';
import { StudentsTab } from './sidebar/tabs/students';
import React from 'react';

export const Dashboard = () => {
	const { tab } = useTabProvider();

	const currentTab = React.useMemo(() => {
		switch (tab) {
			case Tab.Quiz:
				return <QuizTab />;
			case Tab.Question:
				return <QuestionsTab />;
			case Tab.Class:
				return <ClassesTab />;
			case Tab.Students:
				return <StudentsTab />;
			default:
				return <QuizTab />;
		}
	}, [tab]);

	return (
		<>
			<div className="max-w-[1280px] mx-auto mt-[100px] flex items-start justify-between gap-[50px]">
				<Sidebar />
				{currentTab}
			</div>
		</>
	);
};
