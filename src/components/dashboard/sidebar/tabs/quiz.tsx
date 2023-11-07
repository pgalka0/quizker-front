import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import React, { useState } from 'react';
import { Question } from './questions';
import { Class } from './classes';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { Link } from '@radix-ui/react-navigation-menu';

export type Quiz = {
	id: string;
	name: string;
	questions: string[];
};

export const QuizTab = () => {
	const [quizzes, setQuizzes] = useState<Quiz[]>([]);

	const [classes, setClasses] = useState<Class[]>([]);
	const [selectedClass, setSelectedClass] = useState<string>('');

	// const navigate = useNavigate();

	useAsyncEffect(async () => {
		const data = await fetchApi('/quiz');
		setQuizzes(data.quizzes);
	}, []);

	useAsyncEffect(async () => {
		const data = await fetchApi('/class');
		setClasses(data);
	}, []);

	const { toast } = useToast();

	const handleGenerate = async (id: string) => {
		// {
		// 	"id": "86d7304a-771c-4c72-8a13-c00bdce174ef",
		// 	"questionsAmount": 3,
		// 	"className": "Math class"
		// }
		const res = await fetchApi('/quiz/generate/class', {
			id: id,
			questionsAmount: 5,
			className: selectedClass,
		});

		console.log(res);
		toast({
			title: 'Quiz generated successfully',
			action: (
				<ToastAction altText="Go to pdf">
					<a href={res.pdf} target="_blank">
						Go to pdf
					</a>
				</ToastAction>
			),
		});
	};

	return (
		<>
			<div className="w-full flex flex-col justify-start items-start gap-[24px]">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-start justify-start gap-[5px] flex-col">
						<span className="text-[#000] text-[20px] font-[600]">
							Generator klasówek
						</span>
						<span className="text-[#64748B] text-[14px] font-[300]">
							Zarządzaj ustawieniami konta i konfiguruj
							preferencje poczty e-mail.
						</span>
					</div>
					<CreateQuizModal />
				</div>
				<Separator />
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Nr</TableHead>
							<TableHead>Tytuł Quizu</TableHead>
							<TableHead>Skróty</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{quizzes.map((quiz, idx) => (
							<TableRow key={`${quiz.name}-${idx}`}>
								<TableCell className="font-medium">
									{idx + 1}
								</TableCell>
								<TableCell>{quiz.name}</TableCell>
								<TableCell>
									<div className="flex items-center justify-start gap-[12px]">
										<Dialog>
											<DialogTrigger asChild>
												<Button> Generuj</Button>
											</DialogTrigger>
											<DialogContent className="max-w-[250px]">
												<DialogHeader>
													<DialogTitle>
														Generate Quiz
													</DialogTitle>
													<DialogDescription>
														<Select
															onValueChange={(
																v
															) =>
																setSelectedClass(
																	v
																)
															}
															value={
																selectedClass
															}
														>
															<SelectTrigger className="w-full mt-[12px]">
																<SelectValue placeholder="Klasa" />
															</SelectTrigger>

															<SelectContent>
																{classes.map(
																	(
																		c: Class
																	) => (
																		<SelectItem
																			key={
																				c.name
																			}
																			value={
																				c.name
																			}
																		>
																			{
																				c.name
																			}
																		</SelectItem>
																	)
																)}
															</SelectContent>
														</Select>
														<div className="flex items-center justify-between gap-[12px]">
															<Input
																className="w-full mt-[12px]"
																type="number"
																value={5}
																disabled
															/>
															<Button
																className="mt-[12px] "
																onClick={() =>
																	handleGenerate(
																		quiz.id
																	)
																}
															>
																Generuj
															</Button>
														</div>
													</DialogDescription>
												</DialogHeader>
											</DialogContent>
										</Dialog>
										<ShowDetailsModal quiz={quiz} />
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
};

const ShowDetailsModal = ({ quiz }: { quiz: Quiz }) => {
	const [questions, setQuestions] = useState<Question[]>([]);

	useAsyncEffect(async () => {
		const res = await fetchApi('/question/get', { ids: quiz.questions });
		setQuestions(res);
	}, []);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Szczególy</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[450px]">
				<DialogHeader>
					<DialogTitle>{quiz.name}</DialogTitle>
					<DialogDescription>
						<div>
							{questions.map((q, idx) => (
								<>
									<span key={q.id}>
										{idx + 1}. {q.text}
									</span>
									<br />
								</>
							))}
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

const CreateQuizModal = () => {
	const [selectedQuestions, setSelectedQuestions] = React.useState<string[]>(
		[]
	);

	const [questions, setQuestions] = useState<Question[]>([]);
	const [name, setName] = useState('');
	const { toast } = useToast();

	useAsyncEffect(async () => {
		const res = await fetchApi('/question');
		setQuestions(res);
	}, []);

	const handleCreate = async () => {
		const res = await fetchApi('/quiz/create', {
			name: name,
			questions: selectedQuestions,
		});

		toast({
			title: 'Quiz stworzony pomyślnie',
		});
	};

	return (
		<Dialog>
			<DialogTrigger>
				<Button>Stwórz quiz</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[400px]">
				<DialogHeader>
					<DialogTitle>Stwórz quiz</DialogTitle>
					<div className="flex flex-col align-center justify-start gap-[12px] pt-[12px]">
						<Input
							placeholder="Tytuł"
							onChange={(e) => setName(e.target.value)}
							value={name}
						/>
						<div>
							{selectedQuestions.map((sc, idx) => (
								<div>
									{idx + 1}.{' '}
									{
										questions.filter((q) => q.id === sc)[0]
											.text
									}
								</div>
							))}
						</div>
						<Select
							onValueChange={(e) => {
								if (!selectedQuestions.includes(e)) {
									setSelectedQuestions((p) => [...p, e]);
								}
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Pytania" />
							</SelectTrigger>

							<SelectContent>
								{questions.map((q: Question) => (
									<SelectItem key={q.id} value={q.id}>
										{q.text}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<div className="flex items-center justify-end">
							<Button onClick={handleCreate}>Stwórz</Button>
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
