"use client";

import React, {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Flex,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    Tooltip,
    useBreakpointValue,
    useDisclosure,
    useTheme,
    VStack,
} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-charts-enterprise";
import {
    ColDef,
    CreateCrossFilterChartParams,
    FirstDataRenderedEvent,
} from "ag-grid-community";
import DataGridComponentLight from "@/components/agGrids/DataGrid/DataGridComponentLight";
import {SectionHeader} from "@/components/sectionHeader/SectionHeader";
import {useFetchClient} from "@/hooks/useFetchClient";
import {AgNodeClickEvent} from "ag-charts-types";
import useColor from "@/hooks/useColor";
import HappinessScoreRenderer from "@/components/agGrids/CellRenderers/HappinessScoreRenderer";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import {Info} from "@mui/icons-material";
import UserRenderer from "@/components/agGrids/CellRenderers/UserRenderer";
import CommentsCellRenderer from "@/components/agGrids/CellRenderers/CommentsCellRenderer";
import {useWorkflow} from "@/providers/WorkflowProvider";
import {useUser} from "@/providers/UserProvider";

const ScoresCommentsDashboard: React.FC = () => {


    return (
        <VStack align="stretch" w="full" spacing={6} mb={3}>
            This is going to be the Scores and Comments Dashboard
        </VStack>
    );
};

export default ScoresCommentsDashboard;
