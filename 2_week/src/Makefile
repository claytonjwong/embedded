#******************************************************************************
# Copyright (C) 2017 by Alex Fosdick - University of Colorado
#
# Redistribution, modification or use of this software in source or binary
# forms is permitted as long as the files maintain this copyright. Users are 
# permitted to modify this and use it to learn about the field of embedded
# software. Alex Fosdick and the University of Colorado are not liable for any
# misuse of this material. 
#
#*****************************************************************************

#------------------------------------------------------------------------------
# Makefile for HOST and MSP432 platforms
#
# Use: make [TARGET] [PLATFORM-OVERRIDES]
#
# Build Targets:
#      %.i
#      %.asm
#      %.o
#      compile-all
#      build
#      clean
#      print-VARIABLE
#
# Platform Overrides:
#      HOST
#      MSP432
#
#------------------------------------------------------------------------------

include sources.mk

PLATFORM = HOST
OBJECTS = $(SOURCES:.c=.o)
TARGET = c1m2.out
CFLAGS = -Wall -Werror -O0 -std=c99 $(FLAGS)
DEPFLAGS = -MT $@ -MMD -MP -MF $*.dep

ifeq ($(PLATFORM), HOST)
	CC = gcc
	SIZE = size
	SIZE_FLAGS = -l -m -x
endif
ifeq ($(PLATFORM), MSP432)
	TOOLCHAIN_DIR = /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin
	CC = $(TOOLCHAIN_DIR)/arm-none-eabi-gcc
	SIZE = $(TOOLCHAIN_DIR)/arm-none-eabi-size
	SIZE_FLAGS = -A -x
	ARCH = armv7e-m
	CPU = cortex-m4
	SPECS = nosys.specs
	LINKER_FILE = /Users/clayton.wong/workspace/ese-coursera-course1/assessments/m2/msp432p401r.lds
	LDFLAGS = -Wl,-Map=c1m2.map
	PLATFORM_FLAGS = -march=$(ARCH) -mcpu=$(CPU) --specs=$(SPECS) -T $(LINKER_FILE)
	OBJECTS := $(OBJECTS) $(SOURCES_MSP432:.c=.o)
endif

$(TARGET): $(OBJECTS)
	$(CC) -o $@ $^ -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(LDFLAGS) $(PLATFORM_FLAGS)
	$(SIZE) $(SIZE_FLAGS) $@

%.o: %.c
	$(CC) -o $@ -c $< -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(PLATFORM_FLAGS)

%.asm: %.c
	$(CC) -o $@ -S $< -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(PLATFORM_FLAGS)

%.i: %.c
	$(CC) -o $@ -E $< -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(PLATFORM_FLAGS)

.PHONY: clean
clean:
	-@rm *.asm *.dep *.i *.map *.o *.out 2> /dev/null || true

.PHONY: build
build: $(TARGET)

.PHONY: compile-all
compile-all: $(OBJECTS)

print-% :
	@echo $* = $($*)

#------------------------------------------------------------------------------
# Example usage
#
#	$ make clean
#	$ make TARGET=c1m2.out PLATFORM=HOST
#	gcc -o main.o -c main.c -DHOST -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS
#	gcc -o memory.o -c memory.c -DHOST -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS
#	gcc -o c1m2.out main.o memory.o -DHOST -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS
#	size -l -m -x c1m2.out
#	Segment __PAGEZERO: 0x100000000 (vmaddr 0x0 fileoff 0)
#	Segment __TEXT: 0x1000 (vmaddr 0x100000000 fileoff 0)
#		Section __text: 0x275 (addr 0x100000d10 offset 3344)
#		Section __stubs: 0x6 (addr 0x100000f86 offset 3974)
#		Section __stub_helper: 0x1a (addr 0x100000f8c offset 3980)
#		Section __cstring: 0x5 (addr 0x100000fa6 offset 4006)
#		Section __unwind_info: 0x48 (addr 0x100000fac offset 4012)
#		total 0x2e2
#	Segment __DATA: 0x1000 (vmaddr 0x100001000 fileoff 4096)
#		Section __nl_symbol_ptr: 0x10 (addr 0x100001000 offset 4096)
#		Section __la_symbol_ptr: 0x8 (addr 0x100001010 offset 4112)
#		Section __common: 0xa (addr 0x100001020 offset 0)
#		total 0x22
#	Segment __LINKEDIT: 0x1000 (vmaddr 0x100002000 fileoff 8192)
#	total 0x100003000
#
#	$ ./c1m2.out
#	aXy72_L+R
#
#	$ make clean
#	$ make TARGET=c1m2.out PLATFORM=MSP432
#	/Users/clayton.wong/opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o main.o -c main.c -DMSP432 -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T /Users/clayton.wong/workspace/ese-coursera-course1/assessments/m2/msp432p401r.lds
#	/Users/clayton.wong/opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o memory.o -c memory.c -DMSP432 -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T /Users/clayton.wong/workspace/ese-coursera-course1/assessments/m2/msp432p401r.lds
#	/Users/clayton.wong/opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o interrupts_msp432p401r_gcc.o -c interrupts_msp432p401r_gcc.c -DMSP432 -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T /Users/clayton.wong/workspace/ese-coursera-course1/assessments/m2/msp432p401r.lds
#	/Users/clayton.wong/opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o startup_msp432p401r_gcc.o -c startup_msp432p401r_gcc.c -DMSP432 -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T /Users/clayton.wong/workspace/ese-coursera-course1/assessments/m2/msp432p401r.lds
#	/Users/clayton.wong/opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o system_msp432p401r.o -c system_msp432p401r.c -DMSP432 -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T /Users/clayton.wong/workspace/ese-coursera-course1/assessments/m2/msp432p401r.lds
#	/Users/clayton.wong/opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o c1m2.out main.o memory.o interrupts_msp432p401r_gcc.o startup_msp432p401r_gcc.o system_msp432p401r.o -DMSP432 -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T /Users/clayton.wong/workspace/ese-coursera-course1/assessments/m2/msp432p401r.lds
#	/Users/clayton.wong/opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-size -t c1m2.out
#	c1m2.out  :
#	section                     size         addr
#	.intvecs                   0x140          0x0
#	.text                      0xd70        0x140
#	.text:Reset_Handler         0x6c        0xeb0
#	.text:NMI_Handler            0xe        0xf1c
#	.text:HardFault_Handler      0xe        0xf2a
#	.text:Default_Handler        0xe        0xf38
#	.rodata                      0x4        0xf48
#	.eh_frame                    0x4        0xf4c
#	.ARM.exidx                   0x8        0xf50
#	.data                      0x43c   0x20000000
#	.bss                        0x4c   0x2000043c
#	.ARM.attributes             0x2a          0x0
#	.comment                    0x75          0x0
#	.debug_frame               0x2e4          0x0
#	Total                     0x1761
#
#------------------------------------------------------------------------------
