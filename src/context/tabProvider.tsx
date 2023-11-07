import React, { useState } from 'react';

export enum Tab {
	Quiz = 'Quiz',
	Question = 'Question',
	Class = 'Class',
	Students = 'Students',
}

const emptyTabProvider: UseTabProvider = {
	tab: Tab.Quiz,
	setTab: () => null,
};

export type UseTabProvider = {
	setTab: (tab: Tab) => void;
	tab: Tab;
};

const TabContext = React.createContext(emptyTabProvider);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentTab, setCurrentTab] = useState<Tab>(Tab.Quiz);

	return (
		<TabContext.Provider value={{ tab: currentTab, setTab: setCurrentTab }}>
			{children}
		</TabContext.Provider>
	);
};

export const useTabProvider = () => {
	const context = React.useContext(TabContext);

	if (!context) {
		throw new Error('Error while trying to use <TabProvider/>');
	}

	return context;
};
