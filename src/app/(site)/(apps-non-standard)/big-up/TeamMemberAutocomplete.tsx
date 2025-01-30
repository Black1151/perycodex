import React, { useState, useEffect } from "react";
import { Input, Box, Text, Avatar, HStack } from "@chakra-ui/react";
import { BigUpTeamMember } from "./types";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/animations/AnimatedList";

interface TeamMemberAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  teamMembers: BigUpTeamMember[];
  placeholder?: string;
}

const TeamMemberAutocomplete: React.FC<TeamMemberAutocompleteProps> = ({
  value,
  onChange,
  onBlur,
  teamMembers,
  placeholder = "Search team member...",
}) => {
  const [search, setSearch] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<BigUpTeamMember[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredMembers([]);
      return;
    }

    const lowerSearch = search.toLowerCase();
    const matches = teamMembers.filter((member) =>
      member.fullName.toLowerCase().includes(lowerSearch)
    );
    setFilteredMembers(matches);
  }, [search, teamMembers]);

  const handleSelectMember = (member: BigUpTeamMember) => {
    setSearch(member.fullName);
    onChange(String(member.id));
    setShowDropdown(false);
  };

  return (
    <Box position="relative">
      <Input
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onBlur={onBlur}
        onFocus={() => setShowDropdown(true)}
        bg="rgba(0, 0, 0, 0.85)"
        color="perygonPink"
        borderColor="perygonPink"
        _hover={{ borderColor: "perygonPink" }}
        _focus={{ bg: "black", color: "perygonPink" }}
      />

      {showDropdown && filteredMembers.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="rgba(0, 0, 0, 0.85)"
          border="1px solid"
          borderColor="perygonPink"
          borderTop="none"
          zIndex={999}
          maxHeight={300}
          overflowY="auto"
        >
          <AnimatedList>
            {filteredMembers.map((member, index) => (
              <AnimatedListItem key={member.id} index={index}>
                <Box
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: "rgba(255, 20, 147, 0.1)" }}
                  onMouseDown={() => handleSelectMember(member)}
                >
                  <HStack>
                    <Avatar
                      name={member.fullName}
                      src={member.imageUrl}
                      size="sm"
                    />
                    <Text color="perygonPink" ml={2}>
                      {member.fullName}
                    </Text>
                  </HStack>
                </Box>
              </AnimatedListItem>
            ))}
          </AnimatedList>
        </Box>
      )}
    </Box>
  );
};

export default TeamMemberAutocomplete;
