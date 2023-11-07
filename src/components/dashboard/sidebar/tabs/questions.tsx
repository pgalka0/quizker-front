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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import useAsyncEffect from '@/hooks/useAsyncEffect';
import { fetchApi } from '@/lib/fetcher';
import { useState } from 'react';

export type Question = {
	id: string;
	text: string;
	answers: string[];
	correctAnswer: string;
};

export const QuestionsTab = () => {
	const [questions, setQuestions] = useState<Question[]>([]);

	useAsyncEffect(async () => {
		const questions = await fetchApi('/question');
		setQuestions(questions);
	}, []);

	const { toast } = useToast();

	const handleDelete = async (id: string) => {
		const res = await fetchApi('/question/delete', { ids: [id] });

		toast({ title: 'Pytanie usunięte pomyślnie' });
	};

	return (
		<div className="w-full flex flex-col justify-start items-start gap-[24px]">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-start justify-start gap-[5px] flex-col">
					<span className="text-[#000] text-[20px] font-[600]">
						Baza Twoich pytań
					</span>
					<span className="text-[#64748B] text-[14px] font-[300]">
						Zarządzaj ustawieniami konta i konfiguruj preferencje
						poczty e-mail.
					</span>
				</div>
				<AddQuestionModal />
			</div>
			<Separator />
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Nr</TableHead>
						<TableHead>Pytanie</TableHead>
						<TableHead>Skróty</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{questions.map((question, idx) => (
						<TableRow key={`${question.text}-${idx}`}>
							<TableCell className="font-medium">
								{idx + 1}
							</TableCell>
							<TableCell>{question.text}</TableCell>
							<TableCell>
								<div className="flex items-center justify-start gap-[12px]">
									<Dialog>
										<DialogTrigger asChild>
											<Button>Pokaz odpowiedzi</Button>
										</DialogTrigger>
										<DialogContent className="max-w-[350px]">
											<DialogHeader>
												<DialogTitle>
													{question.text}
												</DialogTitle>
												<DialogDescription>
													<div>
														{question.answers.map(
															(a) => (
																<>
																	<span
																		key={a}
																		className={
																			question.correctAnswer ===
																			a
																				? 'font-bold'
																				: ''
																		}
																	>
																		- {a}
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
									<Button
										variant="destructive"
										onClick={() =>
											handleDelete(question.id)
										}
									>
										Delete
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

const AddQuestionModal = () => {
	const { toast } = useToast();

	const [text, setText] = useState('');
	const [correctAnswer, setCorrectAnswer] = useState('');
	const [answerA, setAnswerA] = useState('');
	const [answerB, setAnswerB] = useState('');
	const [answerC, setAnswerC] = useState('');
	const [answerD, setAnswerD] = useState('');
	const [answerE, setAnswerE] = useState('');

	const handleCreate = async () => {
		let ca;
		switch (correctAnswer) {
			case 'answer-A':
				ca = answerA;
				break;
			case 'answer-B':
				ca = answerB;
				break;
			case 'answer-C':
				ca = answerC;
				break;
			case 'answer-D':
				ca = answerD;
				break;
			case 'answer-E':
				ca = answerE;
				break;
		}

		const res = await fetchApi('/question/create', {
			text,
			correctAnswer: ca,
			answers: [answerA, answerB, answerC, answerD, answerE],
		});

		toast({ title: 'Question created successfully' });
	};

	return (
		<Dialog>
			<DialogTrigger>
				<Button>Dodaj nowe pytanie</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[400px]">
				<DialogHeader>
					<DialogTitle>Nowe pytanie</DialogTitle>
					<div className="flex flex-col align-center justify-start gap-[12px] pt-[12px]">
						<Textarea
							placeholder="Pytanie"
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
						<RadioGroup
							value={correctAnswer}
							onValueChange={(v) => setCorrectAnswer(v)}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="answer-A"
									id="answer-A"
								/>
								<Input
									placeholder="Odpowiedź A"
									value={answerA}
									onChange={(e) => setAnswerA(e.target.value)}
								/>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="answer-B"
									id="answer-B"
								/>
								<Input
									placeholder="Odpowiedź B"
									value={answerB}
									onChange={(e) => setAnswerB(e.target.value)}
								/>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="answer-C"
									id="answer-C"
								/>
								<Input
									placeholder="Odpowiedź C"
									value={answerC}
									onChange={(e) => setAnswerC(e.target.value)}
								/>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="answer-D"
									id="answer-D"
								/>
								<Input
									placeholder="Odpowiedź D"
									value={answerD}
									onChange={(e) => setAnswerD(e.target.value)}
								/>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="answer-E"
									id="answer-E"
								/>
								<Input
									placeholder="Odpowiedź E"
									value={answerE}
									onChange={(e) => setAnswerE(e.target.value)}
								/>
							</div>
						</RadioGroup>
						<div className="flex items-center justify-end">
							<Button onClick={handleCreate}>Stwórz</Button>
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
