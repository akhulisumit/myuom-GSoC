/*
  MIT License

  Copyright (c) 2025 Open Source  UOM

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

  Made by Open Source UoM (https://opensource.uom.gr)

  Project members:
    -Apostolidis
    -Davios
    -Iosifidis
    -Konstantinidis
    -Mpakalis
    -Nasis
    -Omiliades
    -Patsouras
    -Fakidis

*/

import { Flex, Box, Text, Button, useColorModeValue, Switch, VStack, HStack, Icon, Badge } from "@chakra-ui/react";
import i18n from "../i18n";
import { TimeIcon, PhoneIcon, CalendarIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { LIBRARY_OPENING_HOURS, LIBRARY_PHONE_LIST } from "../assets/data/Library";

export default function LibraryPage() {
  const [isExamPeriod, setisExamPeriod] = useState(false);
  const currentPeriod = isExamPeriod ? "InExams" : "InSemester";

  // Get current day index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDayIndex = new Date().getDay();

  // Helper to check if a specific schedule corresponds to today
  const isToday = (dayType) => {
    if (dayType === 'weekdays' && currentDayIndex >= 1 && currentDayIndex <= 5) return true;
    if (dayType === 'saturday' && currentDayIndex === 6) return true;
    if (dayType === 'sunday' && currentDayIndex === 0) return true;
    return false;
  };

  const ScheduleRow = ({ label, time, dayType }) => {
    const active = isToday(dayType);
    const isOpen = time && time.start;

    return (
      <HStack
        w="100%"
        justify="space-between"
        p={2}
        bg={active ? useColorModeValue("blue.50", "whiteAlpha.200") : "transparent"}
        borderRadius="md"
        borderLeft={active ? "4px solid" : "none"}
        borderColor={useColorModeValue("blue.500", "blue.200")}
      >
        <HStack>
          <Icon as={allowedDaysIcons[dayType]} color={useColorModeValue("gray.600", "gray.300")} />
          <Text fontWeight={active ? "bold" : "medium"}>{label}</Text>
        </HStack>
        {isOpen ? (
          <Badge colorScheme="green" variant="subtle" px={2} borderRadius="full">
            {time.start} - {time.end}
          </Badge>
        ) : (
          <Badge colorScheme="red" variant="subtle" px={2} borderRadius="full">
            {i18n.t("kleista")}
          </Badge>
        )}
      </HStack>
    );
  };

  const allowedDaysIcons = {
    weekdays: CalendarIcon, // Placeholder, usually a calendar looks good
    saturday: TimeIcon,
    sunday: TimeIcon
  };

  return (
    <Flex
      w="100vw"
      overflowX="none"
      flexDirection="column"
      alignItems="center"
      fontFamily="Syne"
    >
      {/* Wrapper container */}
      <Flex
        textAlign="center"
        flexDirection={{ base: "column", lg: "row" }}
        columnGap="6"
        alignItems="stretch"
        justifyContent="center"
        width="100%"
        maxWidth="1200px"
        paddingX={{ sm: "2", base: "4", md: "8" }}
        py={8}
      >
        {/* Ωράριο Card */}
        <Box
          flex={1}
          border="1px"
          borderRadius="xl"
          bg={useColorModeValue("white", "gray.800")}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          boxShadow="lg"
          p={6}
          display="flex"
          flexDirection="column"
        >
          <Flex justify="space-between" align="center" mb={6}>
            <HeadingWithIcon icon={TimeIcon} title={i18n.t("orario")} />
            <Flex align="center" gap={2}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                {isExamPeriod ? i18n.t("exams_period") : i18n.t("semester_period")}
              </Text>
              <Switch
                isChecked={isExamPeriod}
                onChange={(e) => setisExamPeriod(e.target.checked)}
                colorScheme="blue"
                size="lg"
              />
            </Flex>
          </Flex>

          <VStack spacing={3} align="stretch">
            <ScheduleRow
              label={i18n.t("defPar")}
              time={LIBRARY_OPENING_HOURS[currentPeriod].on_weekdays}
              dayType="weekdays"
            />
            <ScheduleRow
              label={i18n.t("savvato")}
              time={LIBRARY_OPENING_HOURS[currentPeriod].on_saturday}
              dayType="saturday"
            />
            <ScheduleRow
              label={i18n.t("kyriaki")}
              time={LIBRARY_OPENING_HOURS[currentPeriod].on_sunday}
              dayType="sunday"
            />
          </VStack>
        </Box>

        {/* Επικοινωνία Card */}
        <Box
          flex={1}
          border="1px"
          borderRadius="xl"
          bg={useColorModeValue("white", "gray.800")}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          boxShadow="lg"
          p={6}
          mt={{ base: 4, lg: 0 }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <HeadingWithIcon icon={PhoneIcon} title={i18n.t("epikoinonia")} mb={6} />

          <VStack align="start" spacing={4} pl={2}>
            <HStack align="start">
              <Text fontWeight="bold" minW="100px">{i18n.t("imiorofos")}:</Text>
              <VStack align="start" spacing={0}>
                {LIBRARY_PHONE_LIST.map((phone, index) => (
                  <Text key={index} color={useColorModeValue("blue.600", "blue.300")}>{phone}</Text>
                ))}
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </Flex>

      <Button
        mt={6}
        colorScheme="blue"
        variant="link"
        fontSize="lg"
        rightIcon={
          <Icon as={allowedDaysIcons.weekdays} /> // Using calendar icon as generic "link" icon for now or standard arrow
        }
        onClick={() => {
          i18n.language === "en"
            ? window.open("https://www.lib.uom.gr/index.php/en/")
            : window.open("https://www.lib.uom.gr/index.php/el/");
        }}
      >
        {i18n.t("istoselidaVivliothikis")}
      </Button>
    </Flex>
  );
}

const HeadingWithIcon = ({ icon, title, mb }) => (
  <HStack mb={mb} spacing={3}>
    <Flex
      p={2}
      bg={useColorModeValue("blue.100", "blue.900")}
      borderRadius="lg"
      color={useColorModeValue("blue.600", "blue.200")}
    >
      <Icon as={icon} boxSize={5} />
    </Flex>
    <Text fontSize="xl" fontWeight="bold">
      {title}
    </Text>
  </HStack>
);
