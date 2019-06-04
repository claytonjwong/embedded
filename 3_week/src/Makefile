include sources.mk

PLATFORM = HOST
OBJECTS = $(SOURCES:.c=.o)
TARGET = memory
CFLAGS = -Wall -Werror -O0 -std=c99 $(FLAGS)
DEPFLAGS = -MT $@ -MMD -MP -MF $*.dep
TOOLCHAIN_DIR = /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin
CC = $(TOOLCHAIN_DIR)/arm-none-eabi-gcc
SIZE = $(TOOLCHAIN_DIR)/arm-none-eabi-size
SIZE_FLAGS = -A -x
ARCH = armv7e-m
CPU = cortex-m4
SPECS = nosys.specs
LINKER_FILE = msp432p401r.lds
LDFLAGS = -Wl,-Map=memory.map
PLATFORM_FLAGS = -march=$(ARCH) -mcpu=$(CPU) --specs=$(SPECS) -T $(LINKER_FILE)
OBJECTS := $(OBJECTS) $(SOURCES_MSP432:.c=.o)

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
	-@rm *.asm *.dep *.i *.map *.o memory 2> /dev/null || true

.PHONY: build
build: $(TARGET)

.PHONY: compile-all
compile-all: $(OBJECTS)

print-% :
	@echo $* = $($*)

#------------------------------------------------------------------------------
# Example memory analysis
#
#	$ make clean
#	$ make build
#	arm-none-eabi-gcc -o main.o -c main.c -DHOST -I../include -Wall -Werror -O0 -std=c99  -MT main.o -MMD -MP -MF main.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
#	arm-none-eabi-gcc -o misc.o -c misc.c -DHOST -I../include -Wall -Werror -O0 -std=c99  -MT misc.o -MMD -MP -MF misc.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
#	arm-none-eabi-gcc -o memory main.o misc.o -DHOST -I../include -Wall -Werror -O0 -std=c99  -MT memory -MMD -MP -MF .dep -Wl,-Map=memory.map -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
#	arm-none-eabi-size -A -x memory
#	memory  :
#	section             size         addr
#	.text              0xd7c          0x0
#	.rodata             0x18        0xd7c
#	.eh_frame            0x4        0xd94
#	.ARM.exidx           0x8        0xd98
#	.data              0x874   0x20000000
#	.bss                0x88   0x20000874
#	.ARM.attributes     0x2a          0x0
#	.comment            0x75          0x0
#	.debug_frame       0x414          0x0
#	Total             0x1b4f
#
#
#	$ cat memory.map
#
#	Memory Configuration
#
#	Name             Origin             Length             Attributes
#	MAIN_FLASH       0x0000000000000000 0x0000000000040000 xr
#	INFO_FLASH       0x0000000000200000 0x0000000000004000 xr
#	SRAM_CODE        0x0000000001000000 0x0000000000010000 xrw
#	SRAM_DATA        0x0000000020000000 0x0000000000010000 rw
#	*default*        0x0000000000000000 0xffffffffffffffff
#
#
#	$ cat msp432p401r.lds
#
#	MEMORY
#	{
#		MAIN_FLASH (RX) : ORIGIN = 0x00000000, LENGTH = 0x00040000
#		INFO_FLASH (RX) : ORIGIN = 0x00200000, LENGTH = 0x00004000
#		SRAM_CODE  (RWX): ORIGIN = 0x01000000, LENGTH = 0x00010000
#		SRAM_DATA  (RW) : ORIGIN = 0x20000000, LENGTH = 0x00010000
#	}
#
#	REGION_ALIAS("REGION_TEXT", MAIN_FLASH);
#	REGION_ALIAS("REGION_INFO", INFO_FLASH);
#	REGION_ALIAS("REGION_BSS", SRAM_DATA);
#	REGION_ALIAS("REGION_DATA", SRAM_DATA);
#	REGION_ALIAS("REGION_STACK", SRAM_DATA);
#	REGION_ALIAS("REGION_HEAP", SRAM_DATA);
#	REGION_ALIAS("REGION_ARM_EXIDX", MAIN_FLASH);
#	REGION_ALIAS("REGION_ARM_EXTAB", MAIN_FLASH);
#
#
#	$ arm-none-eabi-nm memory | grep g1 && arm-none-eabi-objdump -x memory | grep g1
#	20000890 b g1
#	20000890 l       .bss	00000004 g1
#
#	arm-none-eabi-nm memory | grep g2 && arm-none-eabi-objdump -x memory | grep g2
#	00000d7c R g2
#	00000d7c g     O .rodata	00000004 g2
#
#	$ arm-none-eabi-nm memory | grep g3 && arm-none-eabi-objdump -x memory | grep g3
#	20000004 D g3
#	20000004 g     O .data	00000001 g3
#
#	$ arm-none-eabi-nm memory | grep g4 && arm-none-eabi-objdump -x memory | grep g4
#	20000894 B g4
#	20000894 g     O .bss	00000001 g4
#
#	$ arm-none-eabi-nm memory | grep g5 && arm-none-eabi-objdump -x memory | grep g5
#	20000008 D g5
#	20000008 g     O .data	00000028 g5
#
#	$ arm-none-eabi-nm memory | grep main && arm-none-eabi-objdump -x memory | grep main
#	00000040 T _mainCRTStartup
#	000000b4 T main
#	00000000 l    df *ABS*	00000000 main.c
#	00000040 g     F .text	00000000 _mainCRTStartup
#	000000b4 g     F .text	00000058 main
#
#	$ arm-none-eabi-nm memory | grep func && arm-none-eabi-objdump -x memory | grep func
#	00000108 T func
#	00000108 g     F .text	00000074 func
#
#	$ cat memory.map | grep main
#								  main.o (malloc)
#	LOAD main.o
#					0x0000000000000040                _mainCRTStartup
#	 .text          0x00000000000000b4       0x58 main.o
#					0x00000000000000b4                main
#	 .rodata        0x0000000000000d7c        0x4 main.o
#	 .data          0x0000000020000004        0x1 main.o
#	 .bss           0x0000000020000890        0x5 main.o
#					0x0000000000000068       0x2e main.o
#	 .comment       0x0000000000000000       0x75 main.o
#
#
#	$ arm-none-eabi-objdump -s -j.rodata memory
#
#	memory:     file format elf32-littlearm
#
#	Contents of section .rodata:
#	 0d7c 2d000000 48656c6c 6f20576f 726c6421  -...Hello World!
#	 0d8c 0a000000 38000020                    ....8..
#
#
#	Symbol            Segment     Sub-Segment    Permissions    Lifetime      Answer
#   g1                data        bss            rw             program       2332
#   g2                code        const/rodata   r              program       1512
#   g3                data        data           rw             program       2432
#   g4                data        bss            rw             program       2332
#   g5                data        data           rw             program       2432
#   N                 none        none           none           none          5644
#   l1                register    none           rw             function      4631
#   l2                data        stack          rw             function      2131
#   *l2               data        heap           rw             indefinite    2233
#   l3                data        stack          rw             function      2131
#   f1                data        stack          rw             function      2131
#   f2                data        bss            rw             program       2332
#   f3                data        stack          rw             function      2131
#   "Hello World!"    code        const/rodata   r              program       1512
#   SOME_VALUE        none        none           none           none          5644
#   main              data        text           r              function      1712
#   func              data        text           r              function      1712
#------------------------------------------------------------------------------