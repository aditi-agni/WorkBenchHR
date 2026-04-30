from __future__ import annotations

from enum import Enum


class OnboardingTaskStatus(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"


class TriggerType(str, Enum):
    onboarding_task_completed = "onboarding_task_completed"
    onboarding_task_due = "onboarding_task_due"
    training_completed = "training_completed"
    training_expired = "training_expired"
    manual = "manual"


class GeneratedDocumentStatus(str, Enum):
    queued = "queued"
    generated = "generated"
    failed = "failed"

