import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import useAsyncEffect from '@/hooks/useAsyncEffect';
import { fetchApi } from '@/lib/fetcher';
import { useState } from 'react';
import { Student } from './students';
import { useToast } from '@/components/ui/use-toast';

export type Class = {
	name: string;
	students: string[];
};

export const ClassesTab = () => {
	const [classes, setClasses] = useState<Class[]>([]);
	const [students, setStudents] = useState<Student[]>([]);
	const [selectedStudent, setSelectedStudent] = useState<string>('');

	const { toast } = useToast();

	useAsyncEffect(async () => {
		const classes = await fetchApi('/class');
		setClasses(classes);
	}, []);

	useAsyncEffect(async () => {
		const students = await fetchApi('/user');
		setStudents(students);
	}, []);

	const handleAddStudent = async (classId: string) => {
		const res = await fetchApi('/class/addStudents', {
			name: classId,
			students: [selectedStudent],
		});

		toast({
			title: 'Sukces',
			description: 'Uczeń dodany pomyślnie',
		});
	};

	return (
		<div className="w-full flex flex-col justify-start items-start gap-[24px]">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-start justify-start gap-[5px] flex-col">
					<span className="text-[#000] text-[20px] font-[600]">
						Twoje klasy
					</span>
					<span className="text-[#64748B] text-[14px] font-[300]">
						Zarządzaj ustawieniami konta i konfiguruj preferencje
						poczty e-mail.
					</span>
				</div>
				<CreateClassModal />
			</div>
			<Separator />
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Nr</TableHead>
						<TableHead>Nazwa klasy</TableHead>
						<TableHead>Skróty</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{classes.map((c, idx) => (
						<TableRow key={`${c.name}-${idx}`}>
							<TableCell className="font-medium">
								{idx + 1}
							</TableCell>
							<TableCell>{c.name}</TableCell>
							<TableCell>
								<div className="flex items-center justify-start gap-[10px]">
									<Dialog>
										<DialogTrigger asChild>
											<Button>Pokaz uczniów</Button>
										</DialogTrigger>
										<DialogContent className="max-w-[400px]">
											<DialogHeader>
												<DialogTitle>
													Uczniowie klasy {c.name}
												</DialogTitle>
												<DialogDescription>
													<div>
														{c.students.map(
															(sc) => (
																<>
																	<span
																		key={sc}
																	>
																		-{' '}
																		{
																			students.filter(
																				(
																					s
																				) =>
																					s.id ===
																					sc
																			)[0]
																				?.name
																		}
																	</span>
																	<br />
																</>
															)
														)}
													</div>
												</DialogDescription>
											</DialogHeader>
										</DialogContent>
									</Dialog>
									<Dialog>
										<DialogTrigger asChild>
											<Button>Dodaj ucznia</Button>
										</DialogTrigger>
										<DialogContent className="max-w-[250px]">
											<DialogHeader>
												<DialogTitle>
													Dodaj ucznia
												</DialogTitle>
												<DialogDescription>
													<div className="mt-[12px]"></div>
													<Select
														onValueChange={(v) =>
															setSelectedStudent(
																v
															)
														}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Nowy uczeń" />
														</SelectTrigger>

														<SelectContent>
															{students.map(
																(
																	s: Student
																) => (
																	<SelectItem
																		key={
																			s.name
																		}
																		value={
																			s.id
																		}
																	>
																		{s.name}
																	</SelectItem>
																)
															)}
														</SelectContent>
													</Select>
													<Button
														className="w-full mt-[24px]"
														onClick={() =>
															handleAddStudent(
																c.name
															)
														}
													>
														Dodaj ucznia
													</Button>
												</DialogDescription>
											</DialogHeader>
										</DialogContent>
									</Dialog>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

const CreateClassModal = () => {
	const students = ['Kamil', 'Piotrek', 'Wiktor'];
	const [name, setName] = useState('');

	const { toast } = useToast();
	const handleCreateClass = async () => {
		await fetchApi('/class/create', { name });

		toast({ title: 'Klasa stworzona pomyślnie' });
	};

	return (
		<Dialog>
			<DialogTrigger>
				<Button>Nowa klasa</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[400px]">
				<DialogHeader>
					<DialogTitle>Stwórz klasę</DialogTitle>
					<div className="flex flex-col align-center justify-start gap-[12px] pt-[12px]">
						<Input
							placeholder="Nazwa"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						{/* <Select>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Uczniowie" />
							</SelectTrigger>

							<SelectContent>
								{students.map((s: string) => (
									<SelectItem key={s} value={s}>
										{s}
									</SelectItem>
								))}
							</SelectContent>
						</Select> */}
						<div className="flex items-center justify-end mt-[12px]">
							<Button onClick={handleCreateClass}>Stwórz</Button>
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
