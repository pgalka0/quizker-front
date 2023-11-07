import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { Separator } from '@/components/ui/separator';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import useAsyncEffect from '@/hooks/useAsyncEffect';
import { fetchApi } from '@/lib/fetcher';
import { useState } from 'react';

export type Student = {
	id: string;
	name: string;
	class: string;
};

export const StudentsTab = () => {
	const [students, setStudents] = useState<Student[]>([]);

	useAsyncEffect(async () => {
		const students = await fetchApi('/user');
		setStudents(students);
	}, []);

	return (
		<div className="w-full flex flex-col justify-start items-start gap-[24px]">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-start justify-start gap-[5px] flex-col">
					<span className="text-[#000] text-[20px] font-[600]">
						Twoja baza uczniów
					</span>
					<span className="text-[#64748B] text-[14px] font-[300]">
						Zarządzaj ustawieniami konta i konfiguruj preferencje
						poczty e-mail.
					</span>
				</div>
				<CreateStudentModal />
			</div>
			<Separator />
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Nr</TableHead>
						<TableHead className="w-[300px]">
							Imie & Nazwisko
						</TableHead>
						<TableHead>Klasa</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{students.map((s, idx) => (
						<TableRow key={`${s.name}-${idx}`}>
							<TableCell className="font-medium">
								{idx + 1}
							</TableCell>
							<TableCell>{s.name}</TableCell>
							<TableCell>{s.class}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

const CreateStudentModal = () => {
	const [name, setName] = useState('');
	const { toast } = useToast();
	const handleCreateStudent = async () => {
		const res = await fetchApi('/user/create', { name });

		toast({
			title: 'Sukces',
			description: 'Uczeń stworzony pomyślnie',
		});
	};

	return (
		<Dialog>
			<DialogTrigger>
				<Button>Nowy uczeń</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[400px]">
				<DialogHeader>
					<DialogTitle>Stwórz ucznia</DialogTitle>
					<div className="flex flex-col align-center justify-start gap-[12px] pt-[12px]">
						<Input
							placeholder="Imie & Nazwisko"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<div className="flex items-center justify-end">
							<Button onClick={handleCreateStudent}>
								Stwórz
							</Button>
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
