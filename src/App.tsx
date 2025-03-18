import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  useToast,
  HStack,
  Text,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { Team } from './types';

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [mainTimer, setMainTimer] = useState({
    isRunning: false,
    startTime: null as number | null,
    elapsedTime: 0,
  });
  const toast = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      // Update main timer
      if (mainTimer.isRunning && mainTimer.startTime) {
        setMainTimer(prev => ({
          ...prev,
          elapsedTime: Date.now() - prev.startTime!,
        }));
      }

      // Update individual team timers
      setTeams(prevTeams =>
        prevTeams.map(team => {
          if (team.isTimerRunning && team.startTime) {
            return {
              ...team,
              elapsedTime: Date.now() - team.startTime,
            };
          }
          return team;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [mainTimer.isRunning]);

  const toggleMainTimer = () => {
    setMainTimer(prev => ({
      ...prev,
      isRunning: !prev.isRunning,
      startTime: !prev.isRunning ? Date.now() - prev.elapsedTime : prev.startTime,
    }));
  };

  const resetMainTimer = () => {
    setMainTimer({
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
    });
  };

  const addTeam = () => {
    if (teams.length >= 20) {
      toast({
        title: 'Maximum teams reached',
        description: 'You can only add up to 20 teams',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!newTeamName.trim()) {
      toast({
        title: 'Invalid team name',
        description: 'Please enter a team name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      completionTime: null,
      isTimerRunning: false,
      startTime: null,
      elapsedTime: 0,
    };

    setTeams(prev => [...prev, newTeam]);
    setNewTeamName('');
  };

  const toggleTimer = (teamId: string) => {
    setTeams(prevTeams =>
      prevTeams.map(team => {
        if (team.id === teamId) {
          if (!team.isTimerRunning) {
            return {
              ...team,
              isTimerRunning: true,
              startTime: Date.now() - team.elapsedTime,
            };
          } else {
            return {
              ...team,
              isTimerRunning: false,
              completionTime: team.elapsedTime,
            };
          }
        }
        return team;
      })
    );
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60)
      .toString()
      .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Heading>Team Timer App</Heading>

        <Card w="100%" variant="filled" bg="brand.50">
          <CardBody>
            <VStack spacing={4}>
              <Text fontSize="4xl" fontWeight="bold" fontFamily="monospace">
                {formatTime(mainTimer.elapsedTime)}
              </Text>
              <HStack spacing={4}>
                <Button
                  colorScheme={mainTimer.isRunning ? 'red' : 'green'}
                  size="lg"
                  onClick={toggleMainTimer}
                >
                  {mainTimer.isRunning ? 'Stop Main Timer' : 'Start Main Timer'}
                </Button>
                <Button
                  colorScheme="gray"
                  size="lg"
                  onClick={resetMainTimer}
                  isDisabled={mainTimer.isRunning}
                >
                  Reset Main Timer
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Box w="100%">
          <HStack mb={4}>
            <Input
              placeholder="Enter team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              maxW="300px"
            />
            <Button colorScheme="blue" onClick={addTeam}>
              Add Team
            </Button>
          </HStack>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Team Name</Th>
                <Th>Timer</Th>
                <Th>Actions</Th>
                <Th>Completion Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {teams.map((team) => (
                <Tr key={team.id}>
                  <Td>{team.name}</Td>
                  <Td>{formatTime(team.elapsedTime)}</Td>
                  <Td>
                    <Button
                      colorScheme={team.isTimerRunning ? 'red' : 'green'}
                      onClick={() => toggleTimer(team.id)}
                    >
                      {team.isTimerRunning ? 'Stop' : 'Start'}
                    </Button>
                  </Td>
                  <Td>
                    {team.completionTime ? formatTime(team.completionTime) : '-'}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
};

export default App; 